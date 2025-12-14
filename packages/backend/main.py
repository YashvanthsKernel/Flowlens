"""
FlowLens Backend - FastAPI Server
AI Ops Copilot Backend API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
import uuid
from typing import List, Optional
import random

from models import (
    Incident, ProposedAction, SystemHealth, ServiceHealth,
    PolicyMetrics, Metric, LogEntry, ActionType, Severity
)

app = FastAPI(
    title="FlowLens API",
    description="AI Ops Copilot Backend - Autonomous analysis and action for data-driven teams",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
incidents_db: List[Incident] = []
action_decisions: dict = {}

# Initialize with sample data
def init_sample_data():
    global incidents_db
    
    # Sample incident 1
    incident1 = Incident(
        id=str(uuid.uuid4()),
        title="High Error Rate on User Service",
        description="Error rate exceeded 5% threshold after v2.4.0 deployment",
        severity=Severity.HIGH,
        status="active",
        source="kestra",
        affectedServices=["user-service", "auth-service"],
        timestamp=datetime.now(),
        metrics=[
            Metric(name="error_rate", value=5.2, unit="%", threshold=2.0),
            Metric(name="latency_p99", value=450, unit="ms", threshold=200),
        ],
        logs=[
            LogEntry(timestamp=datetime.now(), level="ERROR", message="Connection refused to database", service="user-service"),
            LogEntry(timestamp=datetime.now(), level="WARN", message="Retry attempt 3/5", service="user-service"),
        ],
        llmAnalysis="The error rate spike correlates with the v2.4.0 deployment. Root cause analysis indicates a schema migration issue causing connection failures.",
        proposedActions=[
            ProposedAction(
                id=str(uuid.uuid4()),
                type=ActionType.ROLLBACK,
                description="Rollback to v2.3.9",
                confidence=0.87,
                reasoning="Previous version was stable with 0.1% error rate",
                risk="medium",
                autoApproved=False
            ),
            ProposedAction(
                id=str(uuid.uuid4()),
                type=ActionType.NOTIFY,
                description="Alert on-call team immediately",
                confidence=0.95,
                reasoning="High severity requires immediate attention",
                risk="low",
                autoApproved=True
            ),
        ]
    )
    
    # Sample incident 2
    incident2 = Incident(
        id=str(uuid.uuid4()),
        title="API Gateway CPU Spike",
        description="CPU utilization reached 92% on api-gateway pods",
        severity=Severity.MEDIUM,
        status="pending",
        source="prometheus",
        affectedServices=["api-gateway"],
        timestamp=datetime.now(),
        metrics=[
            Metric(name="cpu_usage", value=92, unit="%", threshold=80),
            Metric(name="memory_usage", value=78, unit="%", threshold=85),
        ],
        logs=[
            LogEntry(timestamp=datetime.now(), level="WARN", message="High CPU detected", service="api-gateway"),
        ],
        llmAnalysis="Traffic surge detected from viral content. Recommend horizontal scaling.",
        proposedActions=[
            ProposedAction(
                id=str(uuid.uuid4()),
                type=ActionType.SCALE_UP,
                description="Scale to 6 replicas",
                confidence=0.91,
                reasoning="Current load requires additional capacity",
                risk="low",
                autoApproved=True
            ),
        ]
    )
    
    incidents_db = [incident1, incident2]

init_sample_data()


# ============== HEALTH ENDPOINTS ==============

@app.get("/api/health")
async def get_system_health() -> SystemHealth:
    """Get overall system health status"""
    services = [
        ServiceHealth(name="api-gateway", status="healthy", latency=45, uptime=99.9),
        ServiceHealth(name="user-service", status="degraded", latency=230, uptime=98.5),
        ServiceHealth(name="auth-service", status="healthy", latency=32, uptime=99.99),
        ServiceHealth(name="payment-service", status="healthy", latency=89, uptime=99.95),
        ServiceHealth(name="notification-service", status="healthy", latency=56, uptime=99.8),
    ]
    
    active_incidents = len([i for i in incidents_db if i.status == "active"])
    
    return SystemHealth(
        overall="degraded" if active_incidents > 0 else "healthy",
        services=services,
        activeIncidents=active_incidents,
        resolvedToday=7,
        lastUpdated=datetime.now()
    )


@app.get("/api/metrics")
async def get_policy_metrics() -> PolicyMetrics:
    """Get Oumi policy model metrics"""
    return PolicyMetrics(
        decisionAccuracy=0.94,
        falsePositiveRate=0.03,
        avgResponseTime=1.2,
        actionsAutoApproved=156,
        actionsRequiringApproval=23,
        modelVersion="policy-v1.2.0"
    )


# ============== INCIDENT ENDPOINTS ==============

@app.get("/api/incidents")
async def get_incidents() -> List[Incident]:
    """Get all incidents"""
    return sorted(incidents_db, key=lambda x: x.timestamp, reverse=True)


@app.get("/api/incidents/{incident_id}")
async def get_incident(incident_id: str) -> Incident:
    """Get a specific incident by ID"""
    for incident in incidents_db:
        if incident.id == incident_id:
            return incident
    raise HTTPException(status_code=404, detail="Incident not found")


@app.post("/api/incidents/simulate")
async def simulate_incident() -> Incident:
    """Simulate a new incident (for demo purposes)"""
    
    scenarios = [
        {
            "title": "Memory Leak Detected in Cache Service",
            "description": "Memory usage growing unbounded, potential OOM in 2 hours",
            "severity": Severity.HIGH,
            "services": ["cache-service", "redis"],
            "action_type": ActionType.RESTART_SERVICE,
        },
        {
            "title": "Signup Conversion Drop",
            "description": "Signup success rate dropped by 40% in last 15 minutes",
            "severity": Severity.CRITICAL,
            "services": ["frontend", "user-service", "email-service"],
            "action_type": ActionType.ROLLBACK,
        },
        {
            "title": "Database Connection Pool Exhaustion",
            "description": "PostgreSQL connection pool at 95% capacity",
            "severity": Severity.HIGH,
            "services": ["postgres", "api-gateway"],
            "action_type": ActionType.SCALE_UP,
        },
        {
            "title": "SSL Certificate Expiring Soon",
            "description": "Certificate expires in 48 hours",
            "severity": Severity.MEDIUM,
            "services": ["ingress", "api-gateway"],
            "action_type": ActionType.NOTIFY,
        },
    ]
    
    scenario = random.choice(scenarios)
    
    new_incident = Incident(
        id=str(uuid.uuid4()),
        title=scenario["title"],
        description=scenario["description"],
        severity=scenario["severity"],
        status="active",
        source="kestra",
        affectedServices=scenario["services"],
        timestamp=datetime.now(),
        metrics=[
            Metric(name="anomaly_score", value=round(random.uniform(0.7, 0.95), 2), unit="", threshold=0.5),
        ],
        logs=[
            LogEntry(timestamp=datetime.now(), level="ERROR", message=scenario["description"], service=scenario["services"][0]),
        ],
        llmAnalysis=f"AI Analysis: {scenario['description']}. Kestra workflow detected this anomaly and the Oumi policy model has evaluated potential remediation actions.",
        proposedActions=[
            ProposedAction(
                id=str(uuid.uuid4()),
                type=scenario["action_type"],
                description=f"Execute {scenario['action_type'].value} action",
                confidence=round(random.uniform(0.75, 0.95), 2),
                reasoning="Based on historical patterns and current system state",
                risk="medium" if scenario["severity"] in [Severity.HIGH, Severity.CRITICAL] else "low",
                autoApproved=False
            ),
            ProposedAction(
                id=str(uuid.uuid4()),
                type=ActionType.NOTIFY,
                description="Alert team via Slack",
                confidence=0.98,
                reasoning="Team awareness is critical",
                risk="low",
                autoApproved=True
            ),
        ]
    )
    
    incidents_db.insert(0, new_incident)
    return new_incident


# ============== ACTION ENDPOINTS ==============

@app.post("/api/actions/{action_id}/approve")
async def approve_action(action_id: str):
    """Approve a proposed action"""
    for incident in incidents_db:
        for action in incident.proposedActions:
            if action.id == action_id:
                action.autoApproved = True
                action_decisions[action_id] = {
                    "decision": "approved",
                    "timestamp": datetime.now().isoformat(),
                    "incident_id": incident.id
                }
                
                # Update incident status if all actions approved
                if all(a.autoApproved for a in incident.proposedActions):
                    incident.status = "approved"
                
                return {"status": "approved", "action_id": action_id}
    
    raise HTTPException(status_code=404, detail="Action not found")


@app.post("/api/actions/{action_id}/deny")
async def deny_action(action_id: str):
    """Deny a proposed action"""
    for incident in incidents_db:
        for action in incident.proposedActions:
            if action.id == action_id:
                incident.proposedActions = [a for a in incident.proposedActions if a.id != action_id]
                action_decisions[action_id] = {
                    "decision": "denied",
                    "timestamp": datetime.now().isoformat(),
                    "incident_id": incident.id
                }
                return {"status": "denied", "action_id": action_id}
    
    raise HTTPException(status_code=404, detail="Action not found")


@app.get("/api/actions/decisions")
async def get_action_decisions():
    """Get all action decisions (for Oumi training data)"""
    return action_decisions


# ============== NARRATIVE ENDPOINT ==============

@app.get("/api/narrative")
async def get_narrative() -> dict:
    """Generate AI narrative of system state"""
    active = len([i for i in incidents_db if i.status == "active"])
    pending = len([i for i in incidents_db if i.status == "pending"])
    
    narrative = f"""## System Overview (Last 24 Hours)

### Current Status
- **{active} active incidents** requiring attention
- **{pending} pending** actions awaiting review
- **7 incidents resolved** automatically today

### Key Events
1. User service experienced elevated error rates following v2.4.0 deployment
2. API Gateway scaled automatically in response to traffic surge
3. Oumi policy model auto-approved 12 low-risk actions

### Recommendations
- Review pending rollback action for user-service
- Consider increasing capacity before peak hours
- Policy model accuracy: 94% - performing within expected range
"""
    
    return {"narrative": narrative, "generated_at": datetime.now().isoformat()}


# ============== ROOT ==============

@app.get("/")
async def root():
    return {
        "name": "FlowLens API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
