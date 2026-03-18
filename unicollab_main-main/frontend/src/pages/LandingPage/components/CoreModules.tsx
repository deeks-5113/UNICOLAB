import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { IdCard, Search, Users, Bot, BarChart2 } from 'lucide-react';

const MODULES = [
    {
        title: "Digital Passport",
        description: "Your skills and portfolio identity beyond GPA. Showcase your verified projects and stack.",
        icon: IdCard,
        iconColor: "text-[var(--primary)]",
        blobClass: "top-0 right-0 w-64 h-64 bg-[var(--primary)]/20 blur-[80px] -translate-y-1/2 translate-x-1/2",
        shadeColor: "#fdba74", // orange-300
        tags: [
            { text: "Github Verified" },
            { text: "3 Projects" }
        ]
    },
    {
        title: "Smart Discovery",
        description: "Filter by dept, year, or skill in <30s. Find the perfect match for your next hackathon or semester project.",
        icon: Search,
        iconColor: "text-[var(--accent)]",
        blobClass: "bottom-0 left-0 w-32 h-32 bg-[var(--accent)]/20 blur-[40px] translate-y-1/2 -translate-x-1/2",
        shadeColor: "#93c5fd", // blue-300
    },
    {
        title: "Collaboration Engine",
        description: "Streamlined application tracking, role assignment, and automated notifications to keep teams aligned.",
        icon: Users,
        iconColor: "text-purple-300",
        blobClass: "top-0 left-0 w-32 h-32 bg-purple-500/20 blur-[40px] -translate-y-1/2 -translate-x-1/2",
        shadeColor: "#d8b4fe", // purple-300
    },
    {
        title: "AI Project Guide",
        description: "The intelligent mentor for technical roadblocks. 24/7 support for debugging and architectural decisions.",
        icon: Bot,
        iconColor: "text-[var(--primary)]",
        blobClass: "bottom-0 right-0 w-32 h-32 bg-[var(--primary)]/20 blur-[40px] translate-y-1/2 translate-x-1/2",
        shadeColor: "#fcd34d", // amber-300
    },
    {
        title: "Admin Analytics",
        description: "Real-time data for university leads on campus trends, project success rates, and interdisciplinary collaboration.",
        icon: BarChart2,
        iconColor: "text-[var(--accent)]",
        blobClass: "top-1/2 left-1/2 w-48 h-48 bg-[var(--accent)]/20 blur-[60px] -translate-x-1/2 -translate-y-1/2",
        shadeColor: "#6ee7b7", // emerald-300
    }
];

interface StickyCardProps {
    i: number;
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    blobClass: string;
    tags?: { text: string }[];
    shadeColor: string;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

const StickyCard = ({ i, title, description, icon: Icon, iconColor, blobClass, shadeColor, tags, progress, range, targetScale }: StickyCardProps) => {
    const container = useRef<HTMLDivElement>(null);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="sticky top-0 flex items-center justify-center h-screen">
            <motion.div
                style={{
                    scale,
                    top: `calc(-5vh + ${i * 25 + 100}px)`,
                }}
                className="relative -top-1/4 flex flex-col w-[90vw] max-w-4xl h-[500px] origin-top rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--text-main)]/10 shadow-2xl"
            >
                {/* Edge Shading Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.15]"
                    style={{
                        background: `radial-gradient(ellipse at center, transparent 30%, ${shadeColor} 120%)`,
                    }}
                ></div>

                <div className={`absolute rounded-full transition-all duration-700 ${blobClass} group-hover:scale-110 opacity-30`}></div>

                <div className="relative z-10 h-full flex flex-col p-10 md:p-14">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--text-main)]/10 flex items-center justify-center mb-8 border border-[var(--text-main)]/20">
                        <Icon className={`text-3xl ${iconColor}`} size={32} />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--white)]">{title}</h3>
                    <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl leading-relaxed">
                        {description}
                    </p>
                    {tags && (
                        <div className="flex flex-wrap gap-3 mt-auto pt-8">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--bg-page)]/80 text-[var(--text-muted)] border border-[var(--text-main)]/10 backdrop-blur-sm">
                                    {tag.text}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default function CoreModules() {
    const container = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"],
    });

    return (
        <section id="modules" className="relative bg-transparent">
            <div className="md:pt-32 pb-16 text-center z-10 relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--white)]">The Core 5 Modules</h2>
                <p className="text-[var(--text-muted)] max-w-2xl mx-auto px-6">
                    Everything you need to navigate the university ecosystem.
                    Scroll down to explore the stack.
                </p>
            </div>

            <main ref={container} className="relative flex w-full flex-col items-center justify-center pb-[50vh]">
                {MODULES.map((module, i) => {
                    const targetScale = Math.max(0.5, 1 - (MODULES.length - i - 1) * 0.1);

                    return (
                        <StickyCard
                            key={i}
                            i={i}
                            {...module}
                            progress={scrollYProgress}
                            range={[i * 0.25, 1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </main>
        </section>
    );
}
