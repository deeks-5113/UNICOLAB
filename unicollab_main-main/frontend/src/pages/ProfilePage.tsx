"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit3, ExternalLink, GraduationCap, MapPin, BookOpen, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { domains, availableYears } from "@/lib/data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    full_name: "",
    domain: "",
    year_of_study: "",
    interests: "",
    skills: "",
    portfolio_links: ""
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/profile")
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user in ProfilePage", error)
      toast.error("Failed to load profile.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (!isEditing && user) {
      setFormData({
        full_name: user.profile?.full_name || "",
        domain: user.profile?.domain || "",
        year_of_study: user.profile?.year_of_study || "",
        interests: user.profile?.interests || "",
        skills: user.profile?.skills?.join(", ") || "",
        portfolio_links: user.profile?.portfolio_links?.join(", ") || ""
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      const portfolioArray = formData.portfolio_links.split(',').map(s => s.trim()).filter(Boolean)

      const payload = {
        full_name: formData.full_name,
        domain: formData.domain,
        year_of_study: formData.year_of_study,
        interests: formData.interests,
        skills: skillsArray,
        portfolio_links: portfolioArray
      }

      const { data } = await api.put("/users/update-profile", payload)
      setUser({ ...user, profile: data.profile || payload })
      setIsEditing(false)
      toast.success("Profile updated successfully")
      // Re-fetch to ensure completeness
      fetchUser()
    } catch (error) {
      console.error("Failed to update profile", error)
      toast.error("Failed to update profile")
    }
  }

  // Calculate initials like "Alex Rivera" -> "AR"
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>
  }

  const name = user?.profile?.full_name || user?.email?.split("@")[0] || "User"
  const email = user?.email || ""
  const initials = getInitials(name)
  const domain = user?.profile?.domain || "Unknown Domain"
  const year = user?.profile?.year_of_study || "Unknown Year"
  const bio = user?.profile?.interests || "No bio available."
  const skills = user?.profile?.skills || []
  const portfolio = user?.profile?.portfolio_links || []
  const interests: string[] = [] // Kept array for structure parity if interests are managed elsewhere, otherwise rendering bio.

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Digital Passport</h1>
          <p className="text-sm text-muted-foreground">
            Your student collaboration profile
          </p>
        </div>
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-card/80"
        >
          <Edit3 className="size-4" />
          {isEditing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      {isEditing ? (
        <div className="rounded-2xl bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="E.g. Alex Rivera"
              className="bg-secondary/50 border-border"
            />
          </div>
            <div className="space-y-2">
              <Label>Domain / Major</Label>
              <Select 
                value={formData.domain} 
                onValueChange={(value) => setFormData({ ...formData, domain: value })}
              >
                <SelectTrigger className="bg-secondary/50 border-border w-full">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year of Study</Label>
              <Select 
                value={formData.year_of_study} 
                onValueChange={(value) => setFormData({ ...formData, year_of_study: value })}
              >
                <SelectTrigger className="bg-secondary/50 border-border w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Bio / Interests</Label>
            <Textarea
              id="interests"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="Tell us about yourself and your interests..."
              className="min-h-[100px] bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, Python, UI Design"
              className="bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio_links">Portfolio Links (comma separated)</Label>
            <Input
              id="portfolio_links"
              value={formData.portfolio_links}
              onChange={(e) => setFormData({ ...formData, portfolio_links: e.target.value })}
              placeholder="github.com/username, linkedin.com/in/username"
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="rounded-2xl bg-card p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Avatar className="size-24 bg-accent text-accent-foreground shrink-0">
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-card-foreground">{name}</h2>
                <p className="mt-0.5 text-sm text-card-foreground/70">{email}</p>
                <p className="mt-2 text-sm text-card-foreground/60 leading-relaxed max-w-lg">
                  {bio}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                  <div className="flex items-center gap-1.5 text-sm text-primary">
                    <Briefcase className="size-4" />
                    <span>{domain}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary">
                    <GraduationCap className="size-4" />
                    <span>{year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl bg-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-card-foreground mb-4">
              <BookOpen className="size-5 text-primary" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills added yet.</span>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-2xl bg-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-card-foreground mb-4">
              <MapPin className="size-5 text-accent" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.length > 0 ? (
                interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="rounded-xl bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No interests added yet.</span>
              )}
            </div>
          </div>

          {/* Portfolio */}
          <div className="rounded-2xl bg-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-card-foreground mb-4">
              <ExternalLink className="size-5 text-primary" />
              Portfolio Links
            </h3>
            <div className="space-y-2">
              {portfolio.length > 0 ? (
                portfolio.map((link: string, index: number) => (
                  <a
                    key={index}
                    href={link.startsWith("http") ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-input/50 p-4 transition-colors hover:bg-accent/10 hover:border-accent/50 group"
                  >
                    <ExternalLink className="size-4 shrink-0" />
                    {link}
                  </a>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No portfolio links added yet.</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
