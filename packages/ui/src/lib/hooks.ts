'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { Incident, SystemHealth, PolicyMetrics } from './api';

/**
 * Hook for fetching and managing incidents
 */
export function useIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIncidents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getIncidents();
            setIncidents(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
        } finally {
            setLoading(false);
        }
    }, []);

    const simulateIncident = useCallback(async () => {
        try {
            const newIncident = await api.simulateIncident();
            setIncidents(prev => [newIncident, ...prev]);
            return newIncident;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to simulate incident');
            throw err;
        }
    }, []);

    const approveAction = useCallback(async (actionId: string) => {
        try {
            await api.approveAction(actionId);
            // Refresh incidents to get updated state
            await fetchIncidents();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve action');
            throw err;
        }
    }, [fetchIncidents]);

    const denyAction = useCallback(async (actionId: string) => {
        try {
            await api.denyAction(actionId);
            // Refresh incidents to get updated state
            await fetchIncidents();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to deny action');
            throw err;
        }
    }, [fetchIncidents]);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    return {
        incidents,
        loading,
        error,
        fetchIncidents,
        simulateIncident,
        approveAction,
        denyAction,
    };
}

/**
 * Hook for fetching system health
 */
export function useSystemHealth() {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getSystemHealth();
            setHealth(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch health');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHealth();
        // Poll every 30 seconds
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, [fetchHealth]);

    return { health, loading, error, refetch: fetchHealth };
}

/**
 * Hook for fetching policy metrics
 */
export function usePolicyMetrics() {
    const [metrics, setMetrics] = useState<PolicyMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);
                const data = await api.getPolicyMetrics();
                setMetrics(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    return { metrics, loading, error };
}

/**
 * Hook for fetching AI narrative
 */
export function useNarrative() {
    const [narrative, setNarrative] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNarrative() {
            try {
                setLoading(true);
                const data = await api.getNarrative();
                setNarrative(data.narrative);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch narrative');
            } finally {
                setLoading(false);
            }
        }
        fetchNarrative();
    }, []);

    return { narrative, loading, error };
}
