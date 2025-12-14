import { Incident, SystemHealth, PolicyMetrics, ServiceHealth } from './types';

// Mock data for demo purposes
// In production, this would come from Kestra flows and the database

export const mockServices: ServiceHealth[] = [
    { name: 'API Gateway', status: 'healthy', uptime: 99.98, latency: 45, errorRate: 0.1 },
    { name: 'User Service', status: 'degraded', uptime: 99.5, latency: 120, errorRate: 2.3 },
    { name: 'Payment Service', status: 'healthy', uptime: 99.99, latency: 85, errorRate: 0.05 },
    { name: 'Analytics Engine', status: 'healthy', uptime: 99.9, latency: 200, errorRate: 0.5 },
    { name: 'Database Cluster', status: 'healthy', uptime: 99.999, latency: 5, errorRate: 0.01 },
];

export const mockSystemHealth: SystemHealth = {
    overall: 'degraded',
    services: mockServices,
    activeIncidents: 2,
    resolvedToday: 7,
};

export const mockPolicyMetrics: PolicyMetrics = {
    totalDecisions: 156,
    autoApproved: 132,
    manualOverrides: 24,
    falsePositives: 3,
    accuracy: 94.2,
    improvedSince: '2025-12-01',
};

export const mockIncidents: Incident[] = [
    {
        id: 'inc-001',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
        title: 'User Signup Rate Dropped 30%',
        summary: 'Significant decrease in user signups detected after deployment v2.4.1. Error rate in User Service increased from 0.5% to 2.3%.',
        severity: 'high',
        status: 'pending_action',
        affectedServices: ['User Service', 'API Gateway'],
        snapshot: {
            id: 'snap-001',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            metrics: [
                { name: 'Signups/hour', value: 142, unit: 'users', trend: 'down', changePercent: -30 },
                { name: 'Error Rate', value: 2.3, unit: '%', trend: 'up', changePercent: 360 },
                { name: 'P95 Latency', value: 450, unit: 'ms', trend: 'up', changePercent: 125 },
            ],
            logs: [
                { timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), level: 'error', service: 'user-service', message: 'ValidationError: email field required but not provided' },
                { timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), level: 'error', service: 'user-service', message: 'Database timeout on user creation' },
                { timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), level: 'warn', service: 'api-gateway', message: 'High latency detected for /api/users/signup endpoint' },
            ],
            deployments: [
                { id: 'dep-001', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), service: 'user-service', version: 'v2.4.1', author: 'dev-bot', status: 'success' },
            ],
        },
        proposedActions: [
            {
                id: 'act-001',
                type: 'rollback',
                description: 'Rollback User Service to v2.4.0',
                risk: 'medium',
                confidence: 87,
                autoApproved: false,
                reasoning: 'The deployment v2.4.1 correlates strongly with the error spike. Previous version was stable for 14 days.',
            },
            {
                id: 'act-002',
                type: 'notify',
                description: 'Alert on-call team via Slack',
                risk: 'low',
                confidence: 95,
                autoApproved: true,
                reasoning: 'High severity incident requires immediate team awareness.',
            },
        ],
        llmAnalysis: `**Root Cause Analysis:**

Based on the deployment timeline and error patterns, the issue appears to be caused by a schema change in v2.4.1 that made the email field required during signup, but the frontend form was not updated to enforce this validation.

**Impact Assessment:**
- Affected Users: ~850 attempted signups failed in the last 15 minutes
- Revenue Impact: Estimated $2,400 in lost potential conversions
- Customer Experience: Users seeing generic error messages

**Recommended Priority:** P1 - Immediate Action Required

**Confidence Level:** 87% based on log correlation and historical patterns`,
        rootCause: 'Schema migration in v2.4.1 added required email validation without frontend sync',
    },
    {
        id: 'inc-002',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
        title: 'Analytics Pipeline Delay',
        summary: 'Daily analytics aggregation job running 40% slower than baseline. No data loss detected.',
        severity: 'medium',
        status: 'analyzing',
        affectedServices: ['Analytics Engine'],
        snapshot: {
            id: 'snap-002',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            metrics: [
                { name: 'Job Duration', value: 42, unit: 'min', trend: 'up', changePercent: 40 },
                { name: 'Records Processed', value: 2400000, unit: 'records', trend: 'stable', changePercent: 0 },
                { name: 'Memory Usage', value: 78, unit: '%', trend: 'up', changePercent: 15 },
            ],
            logs: [
                { timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), level: 'warn', service: 'analytics-engine', message: 'GC pause detected: 2.3s' },
                { timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), level: 'info', service: 'analytics-engine', message: 'Processing batch 15/20' },
            ],
            deployments: [],
        },
        proposedActions: [
            {
                id: 'act-003',
                type: 'run_diagnostics',
                description: 'Run memory profiler on Analytics Engine',
                risk: 'low',
                confidence: 72,
                autoApproved: true,
                reasoning: 'GC pauses suggest memory pressure. Profiling will identify hotspots.',
            },
        ],
        llmAnalysis: `**Preliminary Analysis:**

The analytics pipeline slowdown appears to be related to increased GC pressure, likely due to larger-than-usual data volume or a memory leak in recent changes.

**Recommended Actions:**
1. Run memory profiler (auto-approved)
2. Monitor for completion before escalating

**Confidence Level:** 72% - Need more data from profiler`,
    },
    {
        id: 'inc-003',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        title: 'Payment Gateway Timeout - RESOLVED',
        summary: 'Intermittent timeouts to Stripe API resolved after network configuration update.',
        severity: 'critical',
        status: 'resolved',
        affectedServices: ['Payment Service'],
        snapshot: {
            id: 'snap-003',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            metrics: [
                { name: 'Success Rate', value: 99.9, unit: '%', trend: 'up', changePercent: 12 },
                { name: 'Avg Latency', value: 85, unit: 'ms', trend: 'down', changePercent: -45 },
            ],
            logs: [],
            deployments: [],
        },
        proposedActions: [],
        llmAnalysis: 'Issue resolved. Root cause was network MTU mismatch causing fragmentation on Stripe API calls.',
        rootCause: 'Network MTU configuration issue',
        resolution: 'Updated MTU settings on payment service pods',
        resolvedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
];

// Generate a story narrative from incidents
export function generateNarrative(incidents: Incident[]): string {
    const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'dismissed');
    const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

    let narrative = `## Last 24 Hours Overview\n\n`;

    if (activeIncidents.length === 0) {
        narrative += `✅ **All systems operating normally.** No active incidents detected.\n\n`;
    } else {
        narrative += `⚠️ **${activeIncidents.length} active incident${activeIncidents.length > 1 ? 's' : ''} requiring attention.**\n\n`;

        activeIncidents.forEach((incident, index) => {
            narrative += `### ${index + 1}. ${incident.title}\n`;
            narrative += `${incident.summary}\n\n`;
            narrative += `**Status:** ${incident.status.replace('_', ' ').toUpperCase()} | `;
            narrative += `**Severity:** ${incident.severity.toUpperCase()}\n\n`;
        });
    }

    if (resolvedIncidents.length > 0) {
        narrative += `---\n\n### ✅ Resolved Today (${resolvedIncidents.length})\n\n`;
        resolvedIncidents.forEach(incident => {
            narrative += `- **${incident.title}** — ${incident.resolution || 'Auto-resolved'}\n`;
        });
    }

    return narrative;
}

// Simulate triggering a new incident for demo
export function simulateIncident(): Incident {
    const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: 'CPU Spike Detected on API Gateway',
        summary: 'Sudden CPU usage increase to 92% on API Gateway nodes. Investigating correlation with traffic patterns.',
        severity: 'high',
        status: 'detected',
        affectedServices: ['API Gateway'],
        snapshot: {
            id: `snap-${Date.now()}`,
            timestamp: new Date().toISOString(),
            metrics: [
                { name: 'CPU Usage', value: 92, unit: '%', trend: 'up', changePercent: 85 },
                { name: 'Request Rate', value: 15000, unit: 'req/s', trend: 'up', changePercent: 200 },
                { name: 'Queue Depth', value: 450, unit: 'requests', trend: 'up', changePercent: 900 },
            ],
            logs: [
                { timestamp: new Date().toISOString(), level: 'warn', service: 'api-gateway', message: 'High CPU alert triggered' },
                { timestamp: new Date().toISOString(), level: 'info', service: 'load-balancer', message: 'Traffic spike detected from region us-east-1' },
            ],
            deployments: [],
        },
        proposedActions: [
            {
                id: `act-${Date.now()}-1`,
                type: 'scale_up',
                description: 'Scale API Gateway from 3 to 6 replicas',
                risk: 'low',
                confidence: 91,
                autoApproved: false,
                reasoning: 'Traffic spike is 3x normal. Scaling will distribute load and reduce CPU pressure.',
            },
            {
                id: `act-${Date.now()}-2`,
                type: 'notify',
                description: 'Alert infrastructure team',
                risk: 'low',
                confidence: 98,
                autoApproved: true,
                reasoning: 'Traffic anomaly requires team awareness for potential attack or viral event.',
            },
        ],
        llmAnalysis: `**Rapid Assessment:**

CPU spike correlates with a 3x traffic surge originating primarily from us-east-1. Pattern suggests either:
1. Viral content driving organic traffic (60% probability)
2. DDoS attack attempt (25% probability)
3. Bot/scraper activity (15% probability)

**Immediate Recommendation:** Scale horizontally while investigating traffic source.

**Risk if Unaddressed:** Service degradation within 5-10 minutes at current trajectory.`,
    };

    return newIncident;
}
