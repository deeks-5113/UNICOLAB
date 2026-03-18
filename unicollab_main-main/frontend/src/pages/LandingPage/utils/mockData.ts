export interface Project {
    id: number;
    title: string;
    department: string;
    description: string;
    tags: string[];
    members: number;
    status: string;
    image: string;
}

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        title: "Solar Car Project",
        department: "ME / ECE",
        description: "Designing a high-efficiency solar-powered vehicle for the World Solar Challenge.",
        tags: ["Engineering", "Sustainable Energy", "Automotive"],
        members: 12,
        status: "Recruiting",
        image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "AI Diagnostic App",
        department: "CS / Med",
        description: "Machine learning model to detect early-stage skin conditions via smartphone camera.",
        tags: ["Healthcare", "ML", "Mobile App"],
        members: 8,
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Urban Vertical Garden",
        department: "Architecture / Bio",
        description: "Modular hydroponic systems for high-density urban student housing.",
        tags: ["Sustainability", "Design", "AgriTech"],
        members: 5,
        status: "Planning",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "FinTech for Students",
        department: "Business / CS",
        description: "Budgeting and investment platform tailored for student loans and grants.",
        tags: ["Finance", "App Dev", "React"],
        members: 6,
        status: "Launched",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        title: "Smart Campus Map",
        department: "Geo / CS",
        description: "Real-time navigation with accessibility routes and event overlays.",
        tags: ["GIS", "Mobile", "Accessibility"],
        members: 4,
        status: "Recruiting",
        image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        title: "Robotics Arm",
        department: "Robotics / ME",
        description: "Low-cost 6-axis robotic arm for educational labs.",
        tags: ["Robotics", "Hardware", "3D Printing"],
        members: 7,
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        title: "VR History Museum",
        department: "History / CS",
        description: "Immersive VR experiences of historical campus events.",
        tags: ["VR", "History", "Unity"],
        members: 9,
        status: "Testing",
        image: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?auto=format&fit=crop&q=80&w=800"
    }
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
    { role: 'user', content: "I'm stuck on the authentication flow for my React Native app." },
    { role: 'ai', content: "I can help with that. Are you using Firebase, Auth0, or a custom backend?" },
    { role: 'user', content: "Using Supabase." },
    { role: 'ai', content: "Great choice. For Supabase with React Native, make sure you've installed `react-native-url-polyfill`. Here's a quick snippet to get started..." }
];
