import sys
import uuid
import random
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.models import User, Profile, Project, UserRole
from app.core.security import get_password_hash

DOMAINS = [
    "Computer Science",
    "Engineering",
    "Business",
    "Design",
    "Healthcare",
    "Marketing"
]

SKILLS = [
    "React", "Python", "Node.js", "Figma", 
    "UI/UX", "Machine Learning", "Data Analysis", 
    "Marketing Strategy", "AutoCAD", "SolidWorks",
    "Financial Modeling", "Project Management"
]

PROJECT_IDEAS = [
    ("EcoTrack Mobile App", "An app to track daily carbon footprint and suggest eco-friendly alternatives.", "Computer Science"),
    ("Smart Healthcare Wearable", "A wearable device that monitors vital signs and alerts doctors in real-time.", "Engineering"),
    ("Student Freelance Platform", "A marketplace for university students to offer freelance services locally.", "Business"),
    ("Sustainable Fashion Brand", "An e-commerce store dedicated to upcycled clothing and sustainable fashion.", "Design"),
    ("AI Study Assistant", "An AI-powered tool that creates personalized study schedules and quizzes.", "Computer Science"),
    ("Community Garden Initiative", "A project to establish community gardens in urban food deserts.", "Healthcare"),
    ("Virtual Reality Campus Tour", "A VR app allowing prospective students to tour the campus remotely.", "Design"),
    ("Local Business Marketing Agency", "A student-run agency providing digital marketing services to local businesses.", "Marketing"),
    ("Automated Greenhouse System", "An IoT system for monitoring and controlling greenhouse environments.", "Engineering"),
    ("Peer Mental Health Support Network", "An anonymous platform for students to seek peer-to-peer mental health support.", "Healthcare"),
    ("Blockchain Voting System", "A secure, decentralized voting system for student body elections.", "Computer Science"),
    ("Zero-Waste Grocery Store", "A business plan for a grocery store that eliminates single-use plastics.", "Business"),
    ("Interactive Data Visualization Dashboard", "A web app to visualize complex datasets for researchers.", "Computer Science"),
    ("Accessible Campus Navigation App", "An app guiding visually impaired students across campus.", "Design"),
    ("Renewable Energy Feasibility Study", "A research project assessing the potential for solar panels on campus buildings.", "Engineering"),
    ("Financial Literacy Online Course", "A comprehensive course teaching personal finance to young adults.", "Business"),
    ("Social Media Campaign for Non-Profit", "Designing and executing a campaign to raise awareness for a local charity.", "Marketing"),
    ("Smart Contract Auditing Tool", "A software tool designed to find vulnerabilities in Ethereum smart contracts.", "Computer Science"),
    ("Ergonomic Desk Design", "Designing a new, affordable ergonomic desk for remote workers.", "Design"),
    ("Micro-Investing Mobile App", "An app that rounds up daily purchases and invests the spare change.", "Business")
]

def seed_database():
    db = SessionLocal()
    
    # 1. Ensure we have a dummy founder to own these projects
    founder_email = "seed_founder@example.com"
    founder = db.query(User).filter(User.email == founder_email).first()
    
    if not founder:
        founder = User(
            id=uuid.uuid4(),
            email=founder_email,
            password_hash=get_password_hash("password123"),
            role=UserRole.FOUNDER
        )
        db.add(founder)
        
        profile = Profile(
            id=founder.id, 
            email=founder_email, 
            role=UserRole.FOUNDER,
            full_name="Seed Founder Data"
        )
        db.add(profile)
        db.commit()
        db.refresh(founder)

    print(f"Using Founder ID: {founder.id}")

    # 2. Add 20 Projects
    projects_added = 0
    for title, description, domain in PROJECT_IDEAS:
        # Generate some random requirements
        req_skills = random.sample(SKILLS, k=random.randint(2, 4))
        team_size = random.randint(3, 8)
        
        project = Project(
            id=uuid.uuid4(),
            title=title,
            description=description,
            domain=domain,
            required_skills=req_skills,
            team_size_required=team_size,
            status="open",
            founder_id=founder.id
        )
        db.add(project)
        projects_added += 1

    db.commit()
    print(f"Successfully seeded {projects_added} projects into the database.")
    db.close()

if __name__ == "__main__":
    seed_database()
