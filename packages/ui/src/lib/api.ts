/**
 * FlowLens API Client
 * Connects frontend to Python backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Metric {
    name: string;
    value: number;
    unit: string;
    threshold?: number;
}

export interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    service: string;
}

export interface ProposedAction {
    id: string;
    type: string;
    description: string;
    confidence: number;
    reasoning: string;
    risk: string;
    autoApproved: boolean;
}

export interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    source: string;
    affectedServices: string[];
    timestamp: string;
    metrics: Metric[];
    logs: LogEntry[];
    llmAnalysis?: string;
    proposedActions: ProposedAction[];
}

export interface ServiceHealth {
    name: string;
    status: string;
    latency: number;
    uptime: number;
}

export interface SystemHealth {
    overall: string;
    services: ServiceHealth[];
    activeIncidents: number;
    resolvedToday: number;
    lastUpdated: string;
}

export interface PolicyMetrics {
    decisionAccuracy: number;
    falsePositiveRate: number;
    avgResponseTime: number;
    actionsAutoApproved: number;
    actionsRequiringApproval: number;
    modelVersion: string;
}

class FlowLensAPI {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Health endpoints
    async getSystemHealth(): Promise<SystemHealth> {
        return this.request<SystemHealth>('/api/health');
    }

    async getPolicyMetrics(): Promise<PolicyMetrics> {
        return this.request<PolicyMetrics>('/api/metrics');
    }

    // Incident endpoints
    async getIncidents(): Promise<Incident[]> {
        return this.request<Incident[]>('/api/incidents');
    }

    async getIncident(id: string): Promise<Incident> {
        return this.request<Incident>(`/api/incidents/${id}`);
    }

    async simulateIncident(): Promise<Incident> {
        return this.request<Incident>('/api/incidents/simulate', {
            method: 'POST',
        });
    }

    // Action endpoints
    async approveAction(actionId: string): Promise<{ status: string; action_id: string }> {
        return this.request(`/api/actions/${actionId}/approve`, {
            method: 'POST',
        });
    }

    async denyAction(actionId: string): Promise<{ status: string; action_id: string }> {
        return this.request(`/api/actions/${actionId}/deny`, {
            method: 'POST',
        });
    }

    // Narrative endpoint
    async getNarrative(): Promise<{ narrative: string; generated_at: string }> {
        return this.request('/api/narrative');
    }
}

// Export singleton instance
export const api = new FlowLensAPI();
export default api;
