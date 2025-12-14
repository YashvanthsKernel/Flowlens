"""
FlowLens Backend - Kestra Integration
Service for interacting with Kestra workflows
"""

import httpx
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

KESTRA_URL = os.getenv("KESTRA_URL", "http://localhost:8080")


class KestraService:
    """Service for interacting with Kestra workflow orchestrator"""
    
    def __init__(self, base_url: str = KESTRA_URL):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def trigger_flow(
        self,
        namespace: str,
        flow_id: str,
        inputs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Trigger a Kestra flow execution"""
        url = f"{self.base_url}/api/v1/executions/{namespace}/{flow_id}"
        
        try:
            response = await self.client.post(
                url,
                json=inputs or {},
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": str(e), "status": "failed"}
    
    async def get_execution_status(self, execution_id: str) -> Dict[str, Any]:
        """Get the status of a Kestra execution"""
        url = f"{self.base_url}/api/v1/executions/{execution_id}"
        
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": str(e), "status": "unknown"}
    
    async def collect_snapshot(self) -> Dict[str, Any]:
        """Trigger the collect-snapshot flow"""
        return await self.trigger_flow(
            namespace="flowlens",
            flow_id="collect-snapshot"
        )
    
    async def summarize_incident(self, snapshot_data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger the summarize-incident flow with snapshot data"""
        return await self.trigger_flow(
            namespace="flowlens",
            flow_id="summarize-incident",
            inputs={"snapshot": snapshot_data}
        )
    
    async def execute_decision(self, incident_id: str, action_id: str) -> Dict[str, Any]:
        """Trigger the decision-flow for action execution"""
        return await self.trigger_flow(
            namespace="flowlens",
            flow_id="decision-flow",
            inputs={
                "incident_id": incident_id,
                "action_id": action_id,
                "approved": True
            }
        )
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Singleton instance
kestra_service = KestraService()
