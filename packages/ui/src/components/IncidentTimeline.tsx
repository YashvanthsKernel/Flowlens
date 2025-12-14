'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    ChevronRight,
    Zap,
    Search,
    RotateCcw,
    Bell,
    GitPullRequest,
    Server
} from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus, ActionType } from '@/lib/types';

interface IncidentTimelineProps {
    incidents: Incident[];
    onSelectIncident: (incident: Incident) => void;
    selectedIncidentId?: string;
}

const severityConfig: Record<IncidentSeverity, { color: string; bg: string; glow: string }> = {
    low: { color: 'text-blue-400', bg: 'bg-blue-500/20', glow: '' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', glow: 'glow-amber' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/20', glow: 'glow-red' },
    critical: { color: 'text-red-400', bg: 'bg-red-500/20', glow: 'glow-red' },
};

const statusConfig: Record<IncidentStatus, { icon: React.ElementType; color: string; label: string }> = {
    detected: { icon: Zap, color: 'text-yellow-400', label: 'Detected' },
    analyzing: { icon: Search, color: 'text-blue-400', label: 'Analyzing' },
    pending_action: { icon: Clock, color: 'text-purple-400', label: 'Pending Action' },
    approved: { icon: CheckCircle, color: 'text-green-400', label: 'Approved' },
    resolved: { icon: CheckCircle, color: 'text-green-400', label: 'Resolved' },
    dismissed: { icon: XCircle, color: 'text-gray-400', label: 'Dismissed' },
};

const actionIcons: Record<ActionType, React.ElementType> = {
    notify: Bell,
    rollback: RotateCcw,
    run_diagnostics: Search,
    scale_up: Server,
    restart_service: RotateCcw,
    open_pr: GitPullRequest,
};

export function IncidentTimeline({ incidents, onSelectIncident, selectedIncidentId }: IncidentTimelineProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-lens-400" />
                    Incident Timeline
                </h2>
                <span className="text-sm text-gray-400">
                    {incidents.filter(i => i.status !== 'resolved' && i.status !== 'dismissed').length} active
                </span>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-lens-500 via-flow-500 to-transparent" />

                {/* Incidents */}
                <div className="space-y-4">
                    {incidents.map((incident, index) => {
                        const severity = severityConfig[incident.severity];
                        const status = statusConfig[incident.status];
                        const StatusIcon = status.icon;
                        const isSelected = selectedIncidentId === incident.id;
                        const isResolved = incident.status === 'resolved' || incident.status === 'dismissed';

                        return (
                            <motion.div
                                key={incident.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onSelectIncident(incident)}
                                className={`relative pl-14 cursor-pointer group ${isResolved ? 'opacity-60' : ''}`}
                            >
                                {/* Timeline dot */}
                                <div className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 ${severity.bg} ${severity.color} border-current ${!isResolved ? 'animate-pulse' : ''}`}>
                                    <div className={`absolute inset-0 rounded-full ${severity.bg} animate-ping`} style={{ animationDuration: '2s' }} />
                                </div>

                                {/* Card */}
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className={`glass-card rounded-xl p-4 transition-all duration-300 ${isSelected
                                            ? 'ring-2 ring-lens-500 shadow-lg shadow-lens-500/20'
                                            : 'hover:bg-white/10'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                                                    {incident.severity.toUpperCase()}
                                                </span>
                                                <div className={`flex items-center gap-1 ${status.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{status.label}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-white font-semibold text-sm group-hover:text-lens-300 transition-colors">
                                                {incident.title}
                                            </h3>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-lens-400 transition-colors" />
                                    </div>

                                    {/* Summary */}
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                                        {incident.summary}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {incident.proposedActions.slice(0, 2).map(action => {
                                                const ActionIcon = actionIcons[action.type];
                                                return (
                                                    <div
                                                        key={action.id}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${action.autoApproved
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-purple-500/20 text-purple-400'
                                                            }`}
                                                    >
                                                        <ActionIcon className="w-3 h-3" />
                                                        <span className="capitalize">{action.type.replace('_', ' ')}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Affected services */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {incident.affectedServices.map(service => (
                                            <span
                                                key={service}
                                                className="px-2 py-0.5 bg-flow-500/10 text-flow-400 rounded text-xs"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
