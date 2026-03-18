import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, School, BookOpen, Cpu, Link as LinkIcon, Upload, Plus, X, GraduationCap, Briefcase, Award, FileText, ChevronRight, ChevronLeft, CheckCircle2, MapPin, Building2, Calendar, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const PassportCreate = () => {
    const { token } = useAuth()
    const [activeStep, setActiveStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        university: '',
        department: '',
        year: '',
        location: '',
        bio: '',
        degree: '',
        specialization: '',
        cgpa: '',
        graduation_year: '',
        portfolio: '',
        resume: ''
    })

    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')

    const [projects, setProjects] = useState([])
    const [certificates, setCertificates] = useState([])
    const [achievements, setAchievements] = useState([])

    const steps = [
        { title: 'Personal', icon: <User size={18} /> },
        { title: 'Academic', icon: <School size={18} /> },
        { title: 'Skills', icon: <Cpu size={18} /> },
        { title: 'Work & Projects', icon: <Briefcase size={18} /> },
        { title: 'Achievements', icon: <Award size={18} /> }
    ]

    const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0))

    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    const addItem = (type) => {
        if (type === 'project') setProjects([...projects, { title: '', description: '', tech_stack: [], github_link: '', demo_link: '' }])
        if (type === 'certificate') setCertificates([...certificates, { title: '', organization: '', issue_date: '', certificate_url: '' }])
        if (type === 'achievement') setAchievements([...achievements, { title: '', description: '', date: '' }])
    }

    const updateItem = (type, index, field, value) => {
        if (type === 'project') {
            const newProjects = [...projects]
            newProjects[index][field] = value
            setProjects(newProjects)
        }
        if (type === 'certificate') {
            const newCerts = [...certificates]
            newCerts[index][field] = value
            setCertificates(newCerts)
        }
        if (type === 'achievement') {
            const newAch = [...achievements]
            newAch[index][field] = value
            setAchievements(newAch)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                skills,
                projects,
                certificates,
                achievements,
                student_id: 'auto-detect-on-backend'
            }
            const res = await fetch('/api/passport/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                alert('Passport updated and finalized!')
            }
        } catch (err) {
            console.error('Submission failed', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Full Name" icon={<User size={14} />} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="John Doe" />
                            <InputField label="Location" icon={<MapPin size={14} />} value={formData.location} onChange={v => setFormData({ ...formData, location: v })} placeholder="Palo Alto, CA" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-muted flex items-center gap-2">
                                <BookOpen size={14} className="text-brand" /> Professional Bio
                            </label>
                            <textarea
                                rows="4"
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Write a short summary of your background and goals..."
                                className="input-field px-4 py-3 resize-none"
                            />
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="University" icon={<School size={14} />} value={formData.university} onChange={v => setFormData({ ...formData, university: v })} placeholder="Stanford University" />
                            <InputField label="Department" icon={<Building2 size={14} />} value={formData.department} onChange={v => setFormData({ ...formData, department: v })} placeholder="Computer Science" />
                            <InputField label="Degree" icon={<GraduationCap size={14} />} value={formData.degree} onChange={v => setFormData({ ...formData, degree: v })} placeholder="Bachelor of Technology" />
                            <InputField label="Specialization" icon={<Cpu size={14} />} value={formData.specialization} onChange={v => setFormData({ ...formData, specialization: v })} placeholder="Artificial Intelligence" />
                            <InputField label="CGPA" icon={<Award size={14} />} value={formData.cgpa} onChange={v => setFormData({ ...formData, cgpa: v })} placeholder="3.9" />
                            <InputField label="Graduation Year" icon={<Calendar size={14} />} value={formData.graduation_year} onChange={v => setFormData({ ...formData, graduation_year: v })} placeholder="2025" />
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-muted">Add Technical Skills</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                                    placeholder="Enter skill (e.g. React, Docker)"
                                    className="flex-1 input-field px-4 py-3"
                                />
                                <button type="button" onClick={handleAddSkill} className="w-12 h-12 rounded-xl bg-brand hover:bg-brand-hover flex items-center justify-center text-white transition-colors"><Plus size={20} /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {skills.map(s => (
                                    <span key={s} className="px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs font-bold flex items-center gap-2">
                                        {s} <X size={12} className="cursor-pointer hover:text-brand-hover" onClick={() => setSkills(skills.filter(x => x !== s))} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="flex flex-col gap-10">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><Briefcase size={18} className="text-brand" /> Key Projects</h3>
                                <button type="button" onClick={() => addItem('project')} className="text-xs font-bold text-brand flex items-center gap-1 hover:text-brand-hover"><Plus size={14} /> Add Project</button>
                            </div>
                            <div className="space-y-6">
                                {projects.map((p, i) => (
                                    <div key={i} className="glass-card p-6 bg-bg-input border-border relative">
                                        <button type="button" onClick={() => setProjects(projects.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted hover:text-error-text transition-all"><X size={16} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input placeholder="Project Title" className="bg-transparent border-b border-border py-2 text-foreground font-bold outline-none focus:border-brand" value={p.title} onChange={e => updateItem('project', i, 'title', e.target.value)} />
                                            <input placeholder="GitHub URL" className="bg-transparent border-b border-border py-2 text-muted text-sm outline-none focus:border-brand" value={p.github_link} onChange={e => updateItem('project', i, 'github_link', e.target.value)} />
                                            <textarea placeholder="Brief Description" className="col-span-1 md:col-span-2 bg-transparent border-b border-border py-2 text-sm text-muted outline-none focus:border-brand resize-none" value={p.description} onChange={e => updateItem('project', i, 'description', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><FileText size={18} className="text-brand" /> Certifications</h3>
                                <button type="button" onClick={() => addItem('certificate')} className="text-xs font-bold text-brand flex items-center gap-1 hover:text-brand-hover"><Plus size={14} /> Add Certificate</button>
                            </div>
                            <div className="space-y-6">
                                {certificates.map((c, i) => (
                                    <div key={i} className="glass-card p-6 bg-bg-input border-border relative">
                                        <button type="button" onClick={() => setCertificates(certificates.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted hover:text-error-text transition-all"><X size={16} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input placeholder="Certificate Title" className="bg-transparent border-b border-border py-2 text-foreground font-bold outline-none focus:border-brand" value={c.title} onChange={e => updateItem('certificate', i, 'title', e.target.value)} />
                                            <input placeholder="Issuing Organization" className="bg-transparent border-b border-border py-2 text-muted text-sm outline-none focus:border-brand" value={c.organization} onChange={e => updateItem('certificate', i, 'organization', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><Award size={18} className="text-warning-text" /> Milestones & Achievements</h3>
                            <button type="button" onClick={() => addItem('achievement')} className="text-xs font-bold text-brand flex items-center gap-1 hover:text-brand-hover"><Plus size={14} /> Add Achievement</button>
                        </div>
                        <div className="space-y-6">
                            {achievements.map((a, i) => (
                                <div key={i} className="glass-card p-6 bg-bg-input border-border relative">
                                    <button type="button" onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted hover:text-error-text transition-all"><X size={16} /></button>
                                    <div className="flex flex-col gap-4">
                                        <input placeholder="Achievement Title (e.g. Hackathon Winner)" className="bg-transparent border-b border-border py-2 text-foreground font-bold outline-none focus:border-brand" value={a.title} onChange={e => updateItem('achievement', i, 'title', e.target.value)} />
                                        <textarea placeholder="Describe the impact or achievement details..." className="bg-transparent border-b border-border py-2 text-sm text-muted outline-none focus:border-brand resize-none" value={a.description} onChange={e => updateItem('achievement', i, 'description', e.target.value)} />
                                        <input type="date" className="input-field px-4 py-2 w-auto" value={a.date} onChange={e => updateItem('achievement', i, 'date', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Digital Passport Profile</h2>
                    <p className="text-muted text-lg">Build a verified identity that showcases your true potential.</p>
                </div>
                <div className="flex gap-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= activeStep ? 'w-10 bg-brand' : 'w-4 bg-border'}`} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <div className="glass-card p-6 flex flex-col gap-2">
                        {steps.map((step, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setActiveStep(i)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                    activeStep === i 
                                    ? 'bg-card border border-border shadow-sm text-foreground' 
                                    : 'text-muted hover:text-foreground hover:bg-bg-input'
                                }`}
                            >
                                <div className={`${activeStep === i ? 'text-brand' : 'text-muted'}`}>{step.icon}</div>
                                {step.title}
                                {activeStep > i && <CheckCircle2 size={16} className="ml-auto text-success-text" />}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card p-6 border-dashed border-2 flex flex-col items-center gap-4 text-center group cursor-pointer hover:border-brand/50 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-bg-input flex items-center justify-center text-muted group-hover:bg-brand/10 group-hover:text-brand transition-all">
                            <Upload size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground mb-1">Avatar & Resume</p>
                            <p className="text-[10px] text-muted uppercase font-black tracking-widest leading-relaxed">Update Visuals</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <form onSubmit={handleSubmit} className="glass-card p-10 flex flex-col min-h-[500px]">
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-10 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
                                            {steps[activeStep].icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">{steps[activeStep].title} Details</h3>
                                    </div>
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-muted hover:text-foreground hover:bg-bg-input disabled:opacity-0 transition-all"
                            >
                                <ChevronLeft size={20} /> Back
                            </button>

                            {activeStep === steps.length - 1 ? (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary px-10 py-4 h-auto shadow-sm"
                                >
                                    {isSubmitting ? 'Finalizing...' : 'Finalize & Publish'}
                                    <CheckCircle2 size={20} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-10 py-4 border border-border bg-bg-input text-foreground font-black rounded-2xl hover:bg-card transition-all flex items-center gap-2 active:scale-95"
                                >
                                    Continue <ChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const InputField = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-muted flex items-center gap-2">
            {icon} {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-field px-5 py-4"
        />
    </div>
)

export default PassportCreate
