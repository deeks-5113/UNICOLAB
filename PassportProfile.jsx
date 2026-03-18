import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Globe, Mail, User, ShieldCheck, Award, MessageSquare, ExternalLink, Clock, GraduationCap, Briefcase, FileText, MapPin, Building2, Calendar, Shield } from 'lucide-react'
import AchievementTimeline from '../components/Passport/Timeline'

const PassportProfile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const studentId = userData.student_id;

                if (studentId) {
                    const res = await fetch(`/api/passport/${studentId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setProfile(data.data);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback Mock for demonstration
                setTimeout(() => {
                    setProfile({
                        name: 'John Doe',
                        university: 'Stanford University',
                        department: 'Computer Science',
                        year: 'Final Year',
                        location: 'Palo Alto, California',
                        bio: 'Full-stack developer passionate about building decentralised systems and AI-powered collaboration tools. Over 3 years of experience in React and Node.js ecosystems.',
                        degree: 'Bachelor of Technology',
                        specialization: 'Artificial Intelligence',
                        cgpa: '3.9',
                        graduation_year: '2025',
                        skills: [
                            { skill_name: 'React', is_verified: true },
                            { skill_name: 'Node.js', is_verified: true },
                            { skill_name: 'PostgreSQL', is_verified: false },
                            { skill_name: 'Tailwind CSS', is_verified: true },
                            { skill_name: 'Docker', is_verified: false }
                        ],
                        projects: [
                            {
                                title: 'UniCollab Platform',
                                description: 'A digital passport system for students to showcase their verified skills and projects.',
                                tech_stack: ['React', 'Node.js', 'PostgreSQL'],
                                github_link: 'https://github.com/johndoe/unicollab',
                                demo_link: 'https://unicollab-demo.com'
                            },
                            {
                                title: 'AI Resume Parser',
                                description: 'NLP-based tool that extracts structured data from PDF resumes with 95% accuracy.',
                                tech_stack: ['Python', 'FastAPI', 'PyTorch'],
                                github_link: 'https://github.com/johndoe/ai-parser',
                                demo_link: '#'
                            }
                        ],
                        certificates: [
                            {
                                title: 'AWS Certified Developer',
                                organization: 'Amazon Web Services',
                                issue_date: '2023-10-15',
                                certificate_url: '#'
                            }
                        ],
                        achievements: [
                            {
                                title: 'Global Hackathon Winner',
                                description: 'Ranked 1st among 500+ teams in the Google Cloud Sustainability Challenge.',
                                date: '2024-05-20'
                            },
                            {
                                title: 'Open Source Contributor of the Year',
                                description: 'Awarded for significant contributions to the React core ecosystem.',
                                date: '2023-12-10'
                            }
                        ],
                        email: 'john.doe@stanford.edu',
                        verified: true,
                        score: 950
                    })
                    setLoading(false)
                }, 800)
            } catch (err) {
                console.error(err)
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="h-64 glass-card animate-pulse bg-bg-input border-border" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 h-96 glass-card animate-pulse bg-bg-input border-border" />
                <div className="h-96 glass-card animate-pulse bg-bg-input border-border" />
            </div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20">
            {/* Profile Header — Integrated Brand Theme */}
            <div className="relative rounded-2xl bg-brand p-8 md:p-12 overflow-hidden border border-brand/20">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="relative group">
                        <div className="w-44 h-44 rounded-3xl bg-card border-4 border-white/20 overflow-hidden shadow-2xl flex items-center justify-center p-2">
                            <div className="w-full h-full bg-brand rounded-2xl flex items-center justify-center italic text-5xl font-bold text-white uppercase tracking-tighter">
                                {profile.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        {profile.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-success-text text-white p-2.5 rounded-xl shadow-lg border-4 border-white/20">
                                <ShieldCheck size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tight">{profile.name}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                            <span className="text-white font-bold flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-xl border border-white/10 text-sm">
                                <GraduationCap size={18} /> {profile.degree}
                            </span>
                            <span className="text-blue-100 font-medium flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-xl border border-white/5 text-sm">
                                <Building2 size={18} /> {profile.university}
                            </span>
                            <span className="text-blue-100 font-medium flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-xl border border-white/5 text-sm">
                                <MapPin size={18} /> {profile.location}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <a href={`mailto:${profile.email}`} className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
                                <Mail size={20} />
                            </a>
                            <a href="#" className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
                                <Github size={20} />
                            </a>
                            <button className="px-8 py-3.5 bg-card text-brand font-bold rounded-2xl hover:bg-bg-input transition-all flex items-center gap-2 ml-4">
                                <MessageSquare size={18} /> Contact Student
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl flex flex-col items-center justify-center py-8 px-12 border border-white/20 bg-white/5 min-w-[200px]">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-2 opacity-80">Passport Score</span>
                        <span className="text-6xl font-black text-white tracking-tighter">{profile.score}</span>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full mt-5 overflow-hidden relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '95%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute left-0 top-0 h-full bg-white" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Main Content (Left) */}
                <div className="md:col-span-8 flex flex-col gap-10">
                    {/* Bio — Themed */}
                    <section className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-brand" size={24} />
                            <h3 className="text-2xl font-bold text-foreground">About Me</h3>
                        </div>
                        <p className="text-muted leading-relaxed text-lg">
                            {profile.bio}
                        </p>
                    </section>

                    {/* Skills — Themed */}
                    <section className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Shield className="text-brand" size={24} />
                            <h3 className="text-2xl font-bold text-foreground">Verified Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {profile.skills.map((skill, i) => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={i}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                                        skill.is_verified 
                                        ? 'bg-brand/10 border-brand/30 text-foreground' 
                                        : 'bg-bg-input border-border text-muted opacity-70'
                                    }`}
                                >
                                    <span className="font-bold">{skill.skill_name}</span>
                                    {skill.is_verified && (
                                        <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                                            <ShieldCheck size={12} className="text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Projects — Themed */}
                    <section className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Briefcase className="text-brand" size={24} />
                            <h3 className="text-2xl font-bold text-foreground">Featured Projects</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {profile.projects.map((project, i) => (
                                <div key={i} className="group glass-card bg-bg-input border-border p-6 hover:border-brand/50 transition-all duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h4 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors">{project.title}</h4>
                                        <div className="flex gap-3">
                                            <a href={project.github_link} className="p-2 bg-card rounded-lg border border-border text-muted hover:text-brand transition-colors">
                                                <Github size={18} />
                                            </a>
                                            <a href={project.demo_link} className="p-2 bg-brand/10 rounded-lg text-brand hover:bg-brand hover:text-white transition-all">
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-6 text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech, j) => (
                                            <span key={j} className="badge">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Achievements — Themed */}
                    <section className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-10">
                            <Award className="text-warning-text" size={24} />
                            <h3 className="text-2xl font-bold text-foreground">Achievements & Recognition</h3>
                        </div>
                        <AchievementTimeline achievements={profile.achievements} />
                    </section>
                </div>

                {/* Sidebar (Right) — Themed */}
                <div className="md:col-span-4 flex flex-col gap-10">
                    {/* Academic Pulse — Themed bg-bg-input */}
                    <section className="glass-card p-8 border-border bg-bg-input">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Academic Pulse</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Department', value: profile.department, icon: <Building2 size={16} /> },
                                { label: 'Specialization', value: profile.specialization, icon: <Shield size={16} /> },
                                { label: 'Current CGPA', value: profile.cgpa, icon: <Award size={16} />, highlight: true },
                                { label: 'Graduation Year', value: profile.graduation_year, icon: <Calendar size={16} /> },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <span className="text-[11px] font-bold text-muted uppercase flex items-center gap-2">
                                        {item.icon} {item.label}
                                    </span>
                                    <span className={`text-lg font-bold ${item.highlight ? 'text-brand' : 'text-foreground'}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certificates — Themed */}
                    <section className="glass-card p-8">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Certifications</h3>
                        <div className="space-y-6">
                            {profile.certificates.map((cert, i) => (
                                <div key={i} className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0">
                                    <div className="p-3 bg-brand/10 rounded-2xl">
                                        <FileText size={20} className="text-brand" />
                                    </div>
                                    <div>
                                        <h4 className="text-foreground font-bold text-sm mb-1">{cert.title}</h4>
                                        <p className="text-xs text-muted mb-2">{cert.organization}</p>
                                        <span className="text-[10px] text-brand font-bold uppercase">{cert.issue_date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 rounded-2xl bg-bg-input border border-border text-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-card transition-all group">
                            Upload Certificate <ExternalLink size={16} className="text-muted group-hover:text-foreground" />
                        </button>
                    </section>

                    {/* Quick Stats — Themed cards */}
                    <section className="glass-card p-8 bg-bg-input border-border">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-card rounded-2xl border border-border">
                                <span className="text-2xl font-bold text-foreground">14</span>
                                <p className="text-[10px] text-muted uppercase font-black mt-1">Collabs</p>
                            </div>
                            <div className="p-4 bg-card rounded-2xl border border-border">
                                <span className="text-2xl font-bold text-brand">Lvl 4</span>
                                <p className="text-[10px] text-muted uppercase font-black mt-1">Status</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default PassportProfile
