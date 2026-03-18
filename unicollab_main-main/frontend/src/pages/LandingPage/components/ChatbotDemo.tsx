import { useState, FormEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { MOCK_CHAT_HISTORY, ChatMessage } from '../utils/mockData';

export default function ChatbotDemo() {
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
    const [inputValue, setInputValue] = useState("");

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg: ChatMessage = { role: 'user', content: inputValue };
        setMessages([...messages, newUserMsg]);
        setInputValue("");

        // Simulate AI typing delay
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: "That's an interesting question. Based on the documentation, you should consider implementing a custom hook for that specific logic." }]);
        }, 1000);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    };

    const chatBoxVariants: Variants = {
        hidden: { opacity: 0, x: 200, scale: 0.8 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
    };

    return (
        <section className="py-24" id="ai-guide">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content - Animated Text */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="inline-block px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-6 border border-[var(--primary)]/20">
                            24/7 Technical Support
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6 text-[var(--white)]">
                            Your always-on <br />
                            <span className="text-[var(--primary)]">Technical Mentor.</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                            Stuck on a bug at 2 AM? The AI Project Guide understands your project context, stack, and goals. It offers code snippets, architectural advice, and resource recommendations instantly.
                        </motion.p>

                        <motion.ul variants={itemVariants} className="space-y-4 mb-8">
                            {[
                                "Context-aware code suggestions",
                                "Debug assistance for specific errors",
                                "Resource library tailored to your stack",
                                "Project timeline estimation"
                            ].map((item, i) => (
                                <motion.li key={i} variants={itemVariants} className="flex items-center gap-3 text-[var(--text-muted)]">
                                    <Check className="text-[var(--primary)] shrink-0" size={20} />
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.button variants={itemVariants} className="btn-primary">
                            Try the Demo
                        </motion.button>
                    </motion.div>

                    {/* Right Content: Chat Interface - Extreme Fly-in */}
                    <div className="w-full lg:w-1/2 perspective-1000">
                        <motion.div
                            className="glass-panel rounded-xl overflow-hidden border border-[var(--text-main)]/10 shadow-2xl bg-[var(--bg-page)]/80 backdrop-blur-xl"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, margin: "-100px" }}
                            variants={chatBoxVariants}
                        >
                            {/* Header */}
                            <div className="bg-[var(--text-main)]/5 p-4 border-b border-[var(--text-main)]/10 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="ml-4 text-xs text-[var(--text-muted)] font-mono">AI Project Guide — v2.4.0</div>
                            </div>

                            {/* Chat Area */}
                            <div className="h-[400px] p-6 overflow-y-auto bg-transparent flex flex-col gap-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[var(--primary)] text-[var(--white)]'
                                            : 'bg-[var(--text-main)]/10 text-[var(--text-muted)] border border-[var(--text-main)]/10'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSend} className="p-4 bg-[var(--text-main)]/5 border-t border-[var(--text-main)]/10 flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask a technical question..."
                                    className="flex-1 bg-[var(--bg-page)]/80 border border-[var(--text-main)]/10 rounded-lg px-4 py-2 text-sm text-[var(--white)] focus:outline-none focus:border-[var(--primary)] placeholder-slate-500"
                                />
                                <button type="submit" className="p-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg text-[var(--white)] transition-colors">
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
