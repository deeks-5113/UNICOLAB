import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg-page)]/80 border-t border-[var(--text-main)]/10 pt-16 pb-8 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center text-[var(--white)] text-xs font-bold">
                                U
                            </div>
                            <span className="font-bold text-lg tracking-tight text-[var(--white)]">UniCollab</span>
                        </div>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                            Empowering the next generation of innovators by connecting talent across disciplines.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--white)] mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Marketplace</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Digital Passport</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Collaboration Engine</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">AI Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--white)] mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Student Handbook</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Project Templates</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Support Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--white)] mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Code of Conduct</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--text-main)]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-[var(--text-muted)] text-sm">
                        © {currentYear} UniCollab Inc. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-[var(--text-muted)] hover:text-[var(--white)] transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-[var(--text-muted)] hover:text-[var(--white)] transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="text-[var(--text-muted)] hover:text-[var(--white)] transition-colors"><Github size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
