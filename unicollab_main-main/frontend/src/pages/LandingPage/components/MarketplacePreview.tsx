import { ArrowRight } from 'lucide-react';
import ThreeDImageCarousel from './ThreeDImageCarousel';
import { MOCK_PROJECTS } from '../utils/mockData';

export default function MarketplacePreview() {
    // Transform MOCK_PROJECTS to fit the Carousel's expected format
    const slides = MOCK_PROJECTS; // Since ThreeDImageCarousel now expects Project[]

    return (
        <section className="py-24 relative overflow-hidden" id="marketplace">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left relative z-10">
                <h2 className="text-3xl font-bold mb-2 text-[var(--white)]">Featured Projects</h2>
                <p className="text-[var(--text-muted)]">Join top-tier student initiatives happening now.</p>
            </div>

            {/* Carousel Container */}
            <div className="relative max-w-7xl mx-auto px-6 mb-12 z-10">
                <ThreeDImageCarousel
                    slides={slides}
                    itemCount={5}
                    autoplay={true}
                    delay={2}
                />
            </div>

            {/* View All CTA */}
            <div className="text-center mt-8 relative z-10">
                <button className="btn-ghost flex mx-auto items-center gap-2 border border-[var(--text-main)]/20 text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 px-8 py-3 text-base group">
                    View All Projects
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
}
