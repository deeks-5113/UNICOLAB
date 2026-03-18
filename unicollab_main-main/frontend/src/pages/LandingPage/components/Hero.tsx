import { ArrowRight } from 'lucide-react';
import WaveBackground from './ui/WaveBackground';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" id="home">

            {/* Wave Background */}
            <div className="absolute inset-0 z-0">
                <WaveBackground
                    className="w-full h-full opacity-60"
                    strokeColor="var(--text-muted)"
                    backgroundColor="transparent"
                />
            </div>

            {/* Background Elements (Fallback/Additional) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>

            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium mb-8 animate-[fade-in-up_1s_ease-out_forwards]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                    </span>
                    New: AI Project Mentor Beta
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-[fade-in-up_1s_ease-out_forwards] animation-delay-200 text-[var(--white)]">
                    Where ideas meet <span className="gradient-text">talent.</span>
                </h1>

                <p className="text-xl text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed animate-[fade-in-up_1s_ease-out_forwards] animation-delay-400">
                    Five powerful modules working together to transform how students collaborate across campus. Break down silos and build the future.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-[fade-in-up_1s_ease-out_forwards] animation-delay-400">
                    <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group">
                        Start Collaborating
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="btn-ghost w-full sm:w-auto border border-[var(--text-muted)]/20 hover:border-[var(--text-muted)]/40">
                        View Demo
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 animate-[fade-in-up_1s_ease-out_forwards] animation-delay-400 shadow-xl">
                    <div className="flex flex-col items-center gap-1 w-full md:w-1/3 md:border-r border-[var(--text-muted)]/10">
                        <span className="text-3xl font-bold text-[var(--white)]">500+</span>
                        <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-medium">Active Projects</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-full md:w-1/3 md:border-r border-[var(--text-muted)]/10">
                        <span className="text-3xl font-bold text-[var(--white)]">2.5k</span>
                        <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-medium">Students</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-full md:w-1/3">
                        <span className="text-3xl font-bold text-[var(--white)]">15</span>
                        <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-medium">Departments</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
