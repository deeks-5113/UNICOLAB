export const currentUser = {
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  avatar: "AR",
  domain: "Tech",
  year: "3rd Year",
  skills: ["React", "Node.js", "Python", "Machine Learning", "UI/UX"],
  interests: ["AI", "Web Development", "Open Source"],
  portfolio: ["github.com/alexrivera", "alexrivera.dev"],
  bio: "Full-stack developer passionate about AI and collaborative learning.",
}

export type Project = {
  id: string
  title: string
  description: string
  domain: string
  skills: string[]
  teamSize: number
  currentMembers: number
  owner: string
  ownerAvatar: string
  status: "active" | "recruiting" | "completed"
  progress: number
  createdAt: string
}

export const projects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Legal Research Tool",
    description:
      "Building a smart legal research assistant that uses NLP to analyze case documents and provide relevant precedents.",
    domain: "Tech",
    skills: ["Python", "NLP", "React", "Legal Research"],
    teamSize: 5,
    currentMembers: 3,
    owner: "Sarah Chen",
    ownerAvatar: "SC",
    status: "recruiting",
    progress: 45,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Campus Health Tracker",
    description:
      "A mobile-first web app to help students track health metrics, schedule appointments, and access mental health resources.",
    domain: "Medical",
    skills: ["React Native", "Node.js", "MongoDB", "Health API"],
    teamSize: 4,
    currentMembers: 2,
    owner: "Alex Rivera",
    ownerAvatar: "AR",
    status: "active",
    progress: 65,
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    title: "Startup Pitch Deck Generator",
    description:
      "An AI tool that helps students create professional pitch decks with market analysis and financial projections.",
    domain: "Business",
    skills: ["AI/ML", "Design", "Financial Modeling", "React"],
    teamSize: 3,
    currentMembers: 3,
    owner: "Maya Johnson",
    ownerAvatar: "MJ",
    status: "active",
    progress: 80,
    createdAt: "2025-12-10",
  },
  {
    id: "4",
    title: "Interactive Art Gallery Platform",
    description:
      "A virtual gallery platform for art students to showcase their work with 3D walkthroughs and artist profiles.",
    domain: "Arts",
    skills: ["Three.js", "React", "WebGL", "UI/UX"],
    teamSize: 4,
    currentMembers: 1,
    owner: "Liam Park",
    ownerAvatar: "LP",
    status: "recruiting",
    progress: 20,
    createdAt: "2026-02-01",
  },
  {
    id: "5",
    title: "Environmental Law Database",
    description:
      "A comprehensive database and analysis tool for environmental law cases across different jurisdictions.",
    domain: "Law",
    skills: ["Database Design", "Python", "Legal Analysis", "React"],
    teamSize: 6,
    currentMembers: 4,
    owner: "Emma Willis",
    ownerAvatar: "EW",
    status: "active",
    progress: 55,
    createdAt: "2025-11-28",
  },
  {
    id: "6",
    title: "Student Budget Planner",
    description:
      "A smart budgeting app with AI-driven spending insights and savings recommendations for university students.",
    domain: "Business",
    skills: ["React", "TypeScript", "Chart.js", "AI"],
    teamSize: 3,
    currentMembers: 2,
    owner: "Carlos Diaz",
    ownerAvatar: "CD",
    status: "recruiting",
    progress: 35,
    createdAt: "2026-02-05",
  },
]

export type TeamMember = {
  name: string
  avatar: string
  role: string
  domain: string
}

export type Team = {
  id: string
  projectTitle: string
  members: TeamMember[]
  status: "active" | "completed"
}

export const teams: Team[] = [
  {
    id: "1",
    projectTitle: "Campus Health Tracker",
    members: [
      { name: "Alex Rivera", avatar: "AR", role: "Lead Developer", domain: "Tech" },
      { name: "Priya Sharma", avatar: "PS", role: "UI Designer", domain: "Arts" },
    ],
    status: "active",
  },
  {
    id: "2",
    projectTitle: "AI-Powered Legal Research Tool",
    members: [
      { name: "Sarah Chen", avatar: "SC", role: "Project Lead", domain: "Tech" },
      { name: "Alex Rivera", avatar: "AR", role: "ML Engineer", domain: "Tech" },
      { name: "David Kim", avatar: "DK", role: "Legal Analyst", domain: "Law" },
    ],
    status: "active",
  },
]

export type CollabRequest = {
  id: string
  projectTitle: string
  from: string
  fromAvatar: string
  fromDomain: string
  status: "pending" | "accepted" | "rejected"
  type: "sent" | "received"
  date: string
  message: string
}

export const collabRequests: CollabRequest[] = [
  {
    id: "1",
    projectTitle: "Interactive Art Gallery Platform",
    from: "Liam Park",
    fromAvatar: "LP",
    fromDomain: "Arts",
    status: "pending",
    type: "received",
    date: "2026-02-10",
    message: "Hi! I saw your profile and think your React skills would be perfect for our gallery project.",
  },
  {
    id: "2",
    projectTitle: "Student Budget Planner",
    from: "Carlos Diaz",
    fromAvatar: "CD",
    fromDomain: "Business",
    status: "pending",
    type: "received",
    date: "2026-02-12",
    message: "We need a frontend developer for our budgeting app. Interested?",
  },
  {
    id: "3",
    projectTitle: "Environmental Law Database",
    from: "Alex Rivera",
    fromAvatar: "AR",
    fromDomain: "Tech",
    status: "accepted",
    type: "sent",
    date: "2026-02-08",
    message: "I'd love to help with the database design for this project.",
  },
  {
    id: "4",
    projectTitle: "Startup Pitch Deck Generator",
    from: "Alex Rivera",
    fromAvatar: "AR",
    fromDomain: "Tech",
    status: "pending",
    type: "sent",
    date: "2026-02-14",
    message: "I can contribute to the AI/ML aspects of this tool.",
  },
]

export const recentActivity = [
  { action: "Joined project", detail: "AI-Powered Legal Research Tool", time: "2 hours ago" },
  { action: "Submitted task", detail: "API endpoint for Campus Health Tracker", time: "5 hours ago" },
  { action: "Received request", detail: "From Liam Park for Art Gallery Platform", time: "1 day ago" },
  { action: "Completed milestone", detail: "Health Tracker MVP release", time: "2 days ago" },
  { action: "Updated profile", detail: "Added new skills: Machine Learning", time: "3 days ago" },
]

export const domains = ["Tech", "Law", "Business", "Arts", "Medical"]

export const availableYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"]

export const allSkills = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Machine Learning",
  "UI/UX",
  "Database Design",
  "Legal Research",
  "Financial Modeling",
  "Three.js",
  "NLP",
  "Health API",
  "WebGL",
  "AI/ML",
  "Chart.js",
  "React Native",
  "MongoDB",
  "Design",
  "Legal Analysis",
]
