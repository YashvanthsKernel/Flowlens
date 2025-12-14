'use client';

import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SimulateButtonProps {
    onSimulate: () => Promise<void>;
}

export function SimulateButton({ onSimulate }: SimulateButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await onSimulate();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            disabled={isLoading}
            className="relative group px-6 py-3 bg-gradient-to-r from-lens-500 via-flow-500 to-pink-500 rounded-xl text-white font-semibold text-sm shadow-lg shadow-lens-500/25 hover:shadow-xl hover:shadow-lens-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait overflow-hidden"
        >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-lens-600 via-flow-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-50" />

            {/* Content */}
            <div className="relative flex items-center gap-2">
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Simulating...</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4" />
                        <span>Simulate Incident</span>
                    </>
                )}
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-lens-500 via-flow-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
        </motion.button>
    );
}
