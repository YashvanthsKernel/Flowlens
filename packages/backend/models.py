"""
FlowLens Backend - Pydantic Models
Data models for the API
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from enum import Enum


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ActionType(str, Enum):
    ROLLBACK = "rollback"
    SCALE_UP = "scale_up"
    RESTART_SERVICE = "restart_service"
    NOTIFY = "notify"
    RUN_DIAGNOSTICS = "run_diagnostics"
    OPEN_PR = "open_pr"


class Metric(BaseModel):
    name: str
    value: float
    unit: str
    threshold: Optional[float] = None


class LogEntry(BaseModel):
    timestamp: datetime
    level: str
    message: str
    service: str


class ProposedAction(BaseModel):
    id: str
    type: ActionType
    description: str
    confidence: float
    reasoning: str
    risk: str  # low, medium, high
    autoApproved: bool = False


class Incident(BaseModel):
    id: str
    title: str
    description: str
    severity: Severity
    status: str  # active, pending, approved, resolved
    source: str  # kestra, prometheus, cloudwatch
    affectedServices: List[str]
    timestamp: datetime
    metrics: List[Metric] = []
    logs: List[LogEntry] = []
    llmAnalysis: Optional[str] = None
    proposedActions: List[ProposedAction] = []


class ServiceHealth(BaseModel):
    name: str
    status: str  # healthy, degraded, down
    latency: float  # ms
    uptime: float  # percentage


class SystemHealth(BaseModel):
    overall: str  # healthy, degraded, critical
    services: List[ServiceHealth]
    activeIncidents: int
    resolvedToday: int
    lastUpdated: datetime


class PolicyMetrics(BaseModel):
    decisionAccuracy: float
    falsePositiveRate: float
    avgResponseTime: float  # seconds
    actionsAutoApproved: int
    actionsRequiringApproval: int
    modelVersion: str
