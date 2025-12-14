// FlowLens Core Types

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'detected' | 'analyzing' | 'pending_action' | 'approved' | 'resolved' | 'dismissed';
export type ActionType = 'notify' | 'rollback' | 'run_diagnostics' | 'scale_up' | 'restart_service' | 'open_pr';

export interface Metric {
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
}

export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    service: string;
    message: string;
}

export interface Snapshot {
    id: string;
    timestamp: string;
    metrics: Metric[];
    logs: LogEntry[];
    deployments: DeploymentEvent[];
}

export interface DeploymentEvent {
    id: string;
    timestamp: string;
    service: string;
    version: string;
    author: string;
    status: 'success' | 'failed' | 'in_progress';
}

export interface ProposedAction {
    id: string;
    type: ActionType;
    description: string;
    risk: 'low' | 'medium' | 'high';
    confidence: number; // 0-100
    autoApproved: boolean;
    reasoning: string;
}

export interface Incident {
    id: string;
    timestamp: string;
    title: string;
    summary: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    affectedServices: string[];
    snapshot: Snapshot;
    proposedActions: ProposedAction[];
    llmAnalysis: string;
    rootCause?: string;
    resolution?: string;
    resolvedAt?: string;
}

export interface SystemHealth {
    overall: 'healthy' | 'degraded' | 'critical';
    services: ServiceHealth[];
    activeIncidents: number;
    resolvedToday: number;
}

export interface ServiceHealth {
    name: string;
    status: 'healthy' | 'degraded' | 'critical';
    uptime: number; // percentage
    latency: number; // ms
    errorRate: number; // percentage
}

export interface Decision {
    id: string;
    incidentId: string;
    timestamp: string;
    action: ProposedAction;
    approvedBy?: string;
    executedAt?: string;
    result?: 'success' | 'failed';
    notes?: string;
}

export interface PolicyMetrics {
    totalDecisions: number;
    autoApproved: number;
    manualOverrides: number;
    falsePositives: number;
    accuracy: number; // percentage
    improvedSince: string;
}
