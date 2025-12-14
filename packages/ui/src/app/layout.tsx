import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'FlowLens | AI Ops Copilot',
    description: 'Autonomous analysis and action for data-driven teams. Monitor workflows, summarize incidents, and take intelligent actions.',
    keywords: ['AI', 'Ops', 'Copilot', 'Kestra', 'Oumi', 'LLM', 'Workflow', 'Automation', 'DevOps'],
    authors: [{ name: 'FlowLens Team' }],
    openGraph: {
        title: 'FlowLens | AI Ops Copilot',
        description: 'Autonomous analysis and action for data-driven teams',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="min-h-screen relative">
                    {/* Background effects */}
                    <div className="fixed inset-0 bg-dark-gradient" />
                    <div className="fixed inset-0 opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lens-500/20 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-flow-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                    </div>

                    {/* Main content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
