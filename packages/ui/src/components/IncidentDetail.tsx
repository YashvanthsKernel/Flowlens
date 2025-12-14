'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
    X,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Brain,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    RotateCcw,
    Bell,
    Search,
    Server,
    GitPullRequest,
    ChevronDown,
    ChevronUp,
    FileText,
    Activity,
} from 'lucide-react';
import { Incident, ProposedAction, ActionType, Metric, LogEntry } from '@/lib/types';
import { useState } from 'react';

interface IncidentDetailProps {
    incident: Incident | null;
    onClose: () => void;
    onApproveAction: (actionId: string) => void;
    onDenyAction: (actionId: string) => void;
}

const actionIcons: Record<ActionType, React.ElementType> = {
    notify: Bell,
    rollback: RotateCcw,
    run_diagnostics: Search,
    scale_up: Server,
    restart_service: RotateCcw,
    open_pr: GitPullRequest,
};

const riskColors = {
    low: 'text-green-400 bg-green-500/20',
    medium: 'text-amber-400 bg-amber-500/20',
    high: 'text-red-400 bg-red-500/20',
};

function MetricCard({ metric }: { metric: Metric }) {
    const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;
    const trendColor = metric.trend === 'up'
        ? (metric.changePercent > 0 ? 'text-red-400' : 'text-green-400')
        : metric.trend === 'down'
            ? (metric.changePercent < 0 ? 'text-red-400' : 'text-green-400')
            : 'text-gray-400';

    return (
        <div className="glass rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{metric.name}</span>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-xs">{metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%</span>
                </div>
            </div>
            <div className="text-xl font-bold text-white">
                {metric.value.toLocaleString()} <span className="text-sm text-gray-400">{metric.unit}</span>
            </div>
        </div>
    );
}

function LogEntryRow({ log }: { log: LogEntry }) {
    const levelColors = {
        error: 'text-red-400 bg-red-500/20',
        warn: 'text-amber-400 bg-amber-500/20',
        info: 'text-blue-400 bg-blue-500/20',
        debug: 'text-gray-400 bg-gray-500/20',
    };

    return (
        <div className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0">
            <span className={`px-1.5 py-0.5 rounded text-xs font-mono uppercase ${levelColors[log.level]}`}>
                {log.level}
            </span>
            <span className="text-xs text-gray-500 w-20 shrink-0">{log.service}</span>
            <span className="text-xs text-gray-300 flex-1 font-mono">{log.message}</span>
        </div>
    );
}

function ActionCard({
    action,
    onApprove,
    onDeny
}: {
    action: ProposedAction;
    onApprove: () => void;
    onDeny: () => void;
}) {
    const [showReasoning, setShowReasoning] = useState(false);
    const ActionIcon = actionIcons[action.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-lens-500/20 flex items-center justify-center">
                        <ActionIcon className="w-5 h-5 text-lens-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium text-sm capitalize">
                            {action.type.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-400 text-xs">{action.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${riskColors[action.risk]}`}>
                        {action.risk} risk
                    </span>
                </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-lens-400">{action.confidence}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${action.confidence}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-lens-500 to-flow-500 rounded-full"
                    />
                </div>
            </div>

            {/* Reasoning toggle */}
            <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-lens-400 transition-colors mb-3"
            >
                <Brain className="w-3 h-3" />
                <span>AI Reasoning</span>
                {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
                {showReasoning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3 p-3 bg-white/5 rounded-lg"
                    >
                        <p className="text-xs text-gray-300">{action.reasoning}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            {action.autoApproved ? (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    <span>Auto-approved by policy</span>
                </div>
            ) : (
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onApprove}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-shadow"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDeny}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                        <ThumbsDown className="w-4 h-4" />
                        Deny
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}

export function IncidentDetail({ incident, onClose, onApproveAction, onDenyAction }: IncidentDetailProps) {
    const [activeTab, setActiveTab] = useState<'analysis' | 'metrics' | 'logs'>('analysis');

    if (!incident) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${incident.severity === 'critical' ? 'text-red-400' :
                            incident.severity === 'high' ? 'text-orange-400' :
                                incident.severity === 'medium' ? 'text-amber-400' :
                                    'text-blue-400'
                            }`} />
                        <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{incident.title}</h2>
                    <p className="text-sm text-gray-400">{incident.summary}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 bg-white/5 rounded-lg">
                {[
                    { id: 'analysis', label: 'AI Analysis', icon: Sparkles },
                    { id: 'metrics', label: 'Metrics', icon: Activity },
                    { id: 'logs', label: 'Logs', icon: FileText },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${activeTab === tab.id
                            ? 'bg-lens-500/20 text-lens-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto pr-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'analysis' && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* LLM Analysis */}
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className="w-5 h-5 text-lens-400" />
                                    <h3 className="text-white font-medium">LLM Analysis</h3>
                                    <span className="px-2 py-0.5 bg-lens-500/20 text-lens-400 text-xs rounded-full">
                                        Powered by Qwen-2.5
                                    </span>
                                </div>
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                        {incident.llmAnalysis}
                                    </div>
                                </div>
                            </div>

                            {/* Proposed Actions */}
                            <div>
                                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    Proposed Actions ({incident.proposedActions.length})
                                </h3>
                                <div className="space-y-3">
                                    {incident.proposedActions.map(action => (
                                        <ActionCard
                                            key={action.id}
                                            action={action}
                                            onApprove={() => onApproveAction(action.id)}
                                            onDeny={() => onDenyAction(action.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'metrics' && (
                        <motion.div
                            key="metrics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid grid-cols-1 gap-3">
                                {incident.snapshot.metrics.map((metric, i) => (
                                    <MetricCard key={i} metric={metric} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'logs' && (
                        <motion.div
                            key="logs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-xl p-4"
                        >
                            <div className="space-y-0">
                                {incident.snapshot.logs.length > 0 ? (
                                    incident.snapshot.logs.map((log, i) => (
                                        <LogEntryRow key={i} log={log} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm text-center py-4">No logs available</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
