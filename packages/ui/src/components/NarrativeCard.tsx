'use client';

import { motion } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';

interface NarrativeCardProps {
    narrative: string;
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 relative overflow-hidden"
        >
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-lens-500/20 to-transparent rounded-bl-full" />

            <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lens-500 to-flow-500 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">System Narrative</h2>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI-generated summary
                        </p>
                    </div>
                </div>

                <div className="prose prose-sm prose-invert max-w-none">
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {narrative.split('\n').map((line, i) => {
                            // Style headers
                            if (line.startsWith('## ')) {
                                return (
                                    <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">
                                        {line.replace('## ', '')}
                                    </h3>
                                );
                            }
                            if (line.startsWith('### ')) {
                                return (
                                    <h4 key={i} className="text-md font-semibold text-white mt-3 mb-2 flex items-center gap-2">
                                        {line.replace('### ', '')}
                                    </h4>
                                );
                            }
                            if (line.startsWith('---')) {
                                return <hr key={i} className="border-white/10 my-4" />;
                            }
                            if (line.startsWith('- ')) {
                                return (
                                    <div key={i} className="flex items-start gap-2 ml-2 mb-1">
                                        <span className="text-lens-400 mt-1">•</span>
                                        <span>{line.replace('- ', '')}</span>
                                    </div>
                                );
                            }
                            if (line.includes('✅')) {
                                return <p key={i} className="text-green-400">{line}</p>;
                            }
                            if (line.includes('⚠️')) {
                                return <p key={i} className="text-amber-400">{line}</p>;
                            }
                            return <p key={i} className="mb-2">{line}</p>;
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
