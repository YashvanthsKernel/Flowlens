'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Server,
    Zap,
    TrendingUp,
    Clock
} from 'lucide-react';
import { SystemHealth, ServiceHealth, PolicyMetrics } from '@/lib/types';

interface SystemHealthPanelProps {
    health: SystemHealth;
    policyMetrics: PolicyMetrics;
}

const statusConfig = {
    healthy: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Healthy' },
    degraded: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Degraded' },
    critical: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Critical' },
};

function ServiceCard({ service }: { service: ServiceHealth }) {
    const status = statusConfig[service.status];
    const StatusIcon = status.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-lg p-3 flex items-center gap-3"
        >
            <div className={`w-8 h-8 rounded-lg ${status.bg} flex items-center justify-center`}>
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium truncate">{service.name}</span>
                    <span className={`text-xs ${status.color}`}>{service.uptime.toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{service.latency}ms</span>
                    <span className="text-xs text-gray-400">{service.errorRate}% err</span>
                </div>
            </div>
        </motion.div>
    );
}

export function SystemHealthPanel({ health, policyMetrics }: SystemHealthPanelProps) {
    const overallStatus = statusConfig[health.overall];
    const OverallIcon = overallStatus.icon;

    return (
        <div className="space-y-6">
            {/* Overall Health */}
            <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-flow-400" />
                        System Health
                    </h2>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${overallStatus.bg}`}>
                        <div className={`status-dot ${health.overall}`} />
                        <span className={`text-sm font-medium ${overallStatus.color}`}>
                            {overallStatus.label}
                        </span>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">{health.activeIncidents}</div>
                        <div className="text-xs text-gray-400">Active Incidents</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{health.resolvedToday}</div>
                        <div className="text-xs text-gray-400">Resolved Today</div>
                    </div>
                </div>

                {/* Services */}
                <div className="space-y-2">
                    {health.services.slice(0, 4).map(service => (
                        <ServiceCard key={service.name} service={service} />
                    ))}
                </div>
            </div>

            {/* Policy Metrics (Oumi) */}
            <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-lens-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-lens-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">Policy AI</h3>
                        <p className="text-xs text-gray-400">Powered by Oumi RL</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Accuracy */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Decision Accuracy</span>
                            <span className="text-lens-400">{policyMetrics.accuracy}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${policyMetrics.accuracy}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-lens-500 to-flow-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="glass rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-white">{policyMetrics.totalDecisions}</div>
                            <div className="text-xs text-gray-400">Total Decisions</div>
                        </div>
                        <div className="glass rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-green-400">{policyMetrics.autoApproved}</div>
                            <div className="text-xs text-gray-400">Auto-Approved</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span>Improved by 12% since {policyMetrics.improvedSince}</span>
                    </div>
                </div>
            </div>

            {/* Integration Status */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <Server className="w-4 h-4 text-flow-400" />
                    Integrations
                </h3>
                <div className="space-y-2">
                    {[
                        { name: 'Kestra Workflows', status: 'connected' },
                        { name: 'Oumi Policy Model', status: 'connected' },
                        { name: 'Cline Automation', status: 'connected' },
                        { name: 'CodeRabbit', status: 'connected' },
                    ].map(integration => (
                        <div key={integration.name} className="flex items-center justify-between py-1">
                            <span className="text-xs text-gray-300">{integration.name}</span>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <span className="text-xs text-green-400">Connected</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
