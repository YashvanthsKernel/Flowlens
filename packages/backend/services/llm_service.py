"""
FlowLens Backend - LLM Integration
Service for interacting with open-source LLMs via Ollama
"""

import httpx
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("LLM_MODEL", "qwen2.5:7b")


class LLMService:
    """Service for interacting with Ollama LLMs"""
    
    def __init__(self, base_url: str = OLLAMA_URL, model: str = DEFAULT_MODEL):
        self.base_url = base_url
        self.model = model
        self.client = httpx.AsyncClient(timeout=120.0)
    
    async def generate(self, prompt: str, system: Optional[str] = None) -> str:
        """Generate text using the LLM"""
        url = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        if system:
            payload["system"] = system
        
        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except httpx.HTTPError as e:
            return f"LLM Error: {str(e)}"
    
    async def analyze_incident(
        self,
        metrics: List[Dict[str, Any]],
        logs: List[Dict[str, Any]],
        services: List[str]
    ) -> Dict[str, Any]:
        """Analyze an incident and return root cause + recommendations"""
        
        system_prompt = """You are an AI Ops expert analyzing system incidents.
Provide concise root cause analysis and actionable recommendations.
Be specific about metrics and thresholds."""

        prompt = f"""Analyze this incident:

Services Affected: {', '.join(services)}

Metrics:
{self._format_metrics(metrics)}

Recent Logs:
{self._format_logs(logs)}

Provide:
1. Root Cause Analysis (2-3 sentences)
2. Recommended Actions (bullet points)
3. Severity Assessment
4. Confidence Level (0-100%)
"""
        
        analysis = await self.generate(prompt, system_prompt)
        
        return {
            "analysis": analysis,
            "model": self.model,
            "status": "success"
        }
    
    async def generate_narrative(
        self,
        incidents: List[Dict[str, Any]],
        system_health: Dict[str, Any]
    ) -> str:
        """Generate a natural language narrative of system state"""
        
        system_prompt = """You are a technical writer summarizing system events.
Write clear, concise summaries that a team lead can quickly scan.
Use markdown formatting."""

        prompt = f"""Summarize the last 24 hours of system activity:

System Health: {system_health.get('overall', 'unknown')}
Active Incidents: {len([i for i in incidents if i.get('status') == 'active'])}
Total Incidents: {len(incidents)}

Recent Incidents:
{self._format_incidents(incidents[:5])}

Generate a brief narrative (3-4 paragraphs) covering:
1. Current system status
2. Key events and resolutions
3. Recommendations for the team
"""
        
        return await self.generate(prompt, system_prompt)
    
    def _format_metrics(self, metrics: List[Dict[str, Any]]) -> str:
        lines = []
        for m in metrics[:10]:
            threshold = f" (threshold: {m.get('threshold', 'N/A')})" if m.get('threshold') else ""
            lines.append(f"- {m['name']}: {m['value']}{m.get('unit', '')}{threshold}")
        return "\n".join(lines) if lines else "No metrics available"
    
    def _format_logs(self, logs: List[Dict[str, Any]]) -> str:
        lines = []
        for log in logs[:10]:
            lines.append(f"[{log.get('level', 'INFO')}] {log.get('service', 'unknown')}: {log.get('message', '')}")
        return "\n".join(lines) if lines else "No logs available"
    
    def _format_incidents(self, incidents: List[Dict[str, Any]]) -> str:
        lines = []
        for inc in incidents:
            lines.append(f"- [{inc.get('severity', 'unknown').upper()}] {inc.get('title', 'Unknown')}: {inc.get('status', 'unknown')}")
        return "\n".join(lines) if lines else "No incidents"
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Singleton instance
llm_service = LLMService()
