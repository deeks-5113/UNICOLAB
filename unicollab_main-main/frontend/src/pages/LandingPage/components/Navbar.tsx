import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3 shadow-lg' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--white)] font-bold text-lg shadow-lg group-hover:shadow-[var(--primary)]/50 transition-all">
                        U
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[var(--white)]">UniCollab</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#marketplace" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Marketplace</a>
                    <a href="#my-projects" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">My Projects</a>
                    <a href="#ai-guide" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">AI Guide</a>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-card)]/50 border border-[var(--text-muted)]/20 text-[var(--text-muted)] hover:border-[var(--lp-primary)]/50 hover:text-[var(--lp-text-main)] transition-all text-sm group">
                        <Search size={16} />
                        <span>Search...</span>
                        <span className="text-xs bg-[var(--lp-bg-page)] px-1.5 rounded border border-[var(--text-muted)]/20 group-hover:bg-[var(--lp-bg-card)]">⌘K</span>
                    </button>

                    <div className="h-6 w-px bg-[var(--text-muted)]/20"></div>

                    <a href="/auth" className="text-sm font-medium text-[var(--lp-text-muted)] hover:text-[var(--lp-black)] transition-colors">Log In</a>
                    <a href="/auth" className="btn-primary-lp text-sm px-4 py-2">Sign Up</a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-[var(--lp-text-muted)] hover:text-[var(--lp-black)]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--lp-bg-page)] border-b border-[var(--lp-bg-card)] p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
                    <a href="#marketplace" className="text-[var(--lp-text-muted)] hover:text-[var(--lp-black)] py-2">Marketplace</a>
                    <a href="#my-projects" className="text-[var(--lp-text-muted)] hover:text-[var(--lp-black)] py-2">My Projects</a>
                    <a href="#ai-guide" className="text-[var(--lp-text-muted)] hover:text-[var(--lp-black)] py-2">AI Guide</a>
                    <hr className="border-[var(--lp-bg-card)]" />
                    <a href="/auth" className="w-full text-left text-[var(--lp-text-muted)] hover:text-[var(--lp-black)] py-2">Log In</a>
                    <a href="/auth" className="w-full btn-primary-lp text-center">Sign Up</a>
                </div>
            )}
        </nav>
    );
}
