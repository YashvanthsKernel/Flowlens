'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Github,
    ExternalLink,
    Menu,
    X as XIcon
} from 'lucide-react';
import { IncidentTimeline } from '@/components/IncidentTimeline';
import { IncidentDetail } from '@/components/IncidentDetail';
import { SystemHealthPanel } from '@/components/SystemHealthPanel';
import { SimulateButton } from '@/components/SimulateButton';
import { NarrativeCard } from '@/components/NarrativeCard';
import {
    mockIncidents,
    mockSystemHealth,
    mockPolicyMetrics,
    generateNarrative,
    simulateIncident
} from '@/lib/data';
import { Incident } from '@/lib/types';

export default function Home() {
    const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSimulate = useCallback(async () => {
        // Simulate a processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newIncident = simulateIncident();
        setIncidents(prev => [newIncident, ...prev]);
        setSelectedIncident(newIncident);
    }, []);

    const handleApproveAction = useCallback((actionId: string) => {
        setIncidents(prev => prev.map(incident => ({
            ...incident,
            proposedActions: incident.proposedActions.map(action =>
                action.id === actionId
                    ? { ...action, autoApproved: true }
                    : action
            ),
            status: incident.proposedActions.some(a => a.id === actionId)
                ? 'approved' as const
                : incident.status
        })));
    }, []);

    const handleDenyAction = useCallback((actionId: string) => {
        setIncidents(prev => prev.map(incident => ({
            ...incident,
            proposedActions: incident.proposedActions.filter(action => action.id !== actionId),
        })));
    }, []);

    const narrative = generateNarrative(incidents);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-dark border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lens-500 to-flow-500 flex items-center justify-center shadow-lg shadow-lens-500/30">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient">FlowLens</h1>
                                <p className="text-xs text-gray-400">AI Ops Copilot</p>
                            </div>
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <SimulateButton onSimulate={handleSimulate} />
                            <a
                                href="https://github.com/YashvanthsKernel/Flowlens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm"
                            >
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 glass rounded-lg"
                        >
                            {mobileMenuOpen ? (
                                <XIcon className="w-5 h-5 text-gray-300" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/10"
                        >
                            <div className="p-4 space-y-3">
                                <SimulateButton onSimulate={handleSimulate} />
                                <a
                                    href="https://github.com/YashvanthsKernel/Flowlens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-gray-300 hover:text-white text-sm"
                                >
                                    <Github className="w-4 h-4" />
                                    <span>View on GitHub</span>
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left sidebar - System Health */}
                    <aside className="lg:col-span-3 order-2 lg:order-1">
                        <div className="lg:sticky lg:top-24">
                            <SystemHealthPanel
                                health={mockSystemHealth}
                                policyMetrics={mockPolicyMetrics}
                            />
                        </div>
                    </aside>

                    {/* Center - Timeline & Narrative */}
                    <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                        {/* Narrative */}
                        <NarrativeCard narrative={narrative} />

                        {/* Timeline */}
                        <div className="glass-card rounded-xl p-5">
                            <IncidentTimeline
                                incidents={incidents}
                                onSelectIncident={setSelectedIncident}
                                selectedIncidentId={selectedIncident?.id}
                            />
                        </div>
                    </div>

                    {/* Right - Incident Detail */}
                    <aside className="lg:col-span-4 order-3">
                        <div className="lg:sticky lg:top-24">
                            <AnimatePresence mode="wait">
                                {selectedIncident ? (
                                    <motion.div
                                        key={selectedIncident.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="glass-card rounded-xl p-5 min-h-[600px]"
                                    >
                                        <IncidentDetail
                                            incident={selectedIncident}
                                            onClose={() => setSelectedIncident(null)}
                                            onApproveAction={handleApproveAction}
                                            onDenyAction={handleDenyAction}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass-card rounded-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-lens-500/20 flex items-center justify-center mb-4">
                                            <Layers className="w-8 h-8 text-lens-400" />
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">Select an Incident</h3>
                                        <p className="text-gray-400 text-sm max-w-xs">
                                            Click on an incident from the timeline to view details, AI analysis, and take action.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </aside>
                </div>

                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-400">
                            Built with{' '}
                            <span className="text-lens-400">Kestra</span>,{' '}
                            <span className="text-flow-400">Oumi</span>,{' '}
                            <span className="text-pink-400">Cline</span>, and{' '}
                            <span className="text-green-400">Open-source LLMs</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Deployed on Vercel</span>
                            <span>•</span>
                            <span>Assemble Hack 2025</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
