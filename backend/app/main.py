from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import customers, notes, ai
from app import models, crud, schemas

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Seed sample CRM customers and notes if database is empty."""
    db = SessionLocal()
    try:
        count = db.query(models.Customer).count()
        if count == 0:
            sample_customers = [
                {
                    "name": "Sarah Jenkins",
                    "email": "sarah.jenkins@acmecorp.com",
                    "phone": "+1 (555) 234-5678",
                    "company": "Acme Corp",
                    "stage": "Proposal",
                    "value": 45000.0,
                    "status": "Active",
                    "tags": "Enterprise, High Intent"
                },
                {
                    "name": "Marcus Vance",
                    "email": "m.vance@techinnovate.io",
                    "phone": "+1 (555) 876-5432",
                    "company": "TechInnovate Labs",
                    "stage": "Qualified",
                    "value": 28000.0,
                    "status": "Active",
                    "tags": "SaaS, Urgent"
                },
                {
                    "name": "Elena Rostova",
                    "email": "elena@globallogistics.org",
                    "phone": "+1 (555) 998-1122",
                    "company": "Global Logistics Hub",
                    "stage": "Won",
                    "value": 92000.0,
                    "status": "Active",
                    "tags": "Key Account, Annual Plan"
                },
                {
                    "name": "David Chen",
                    "email": "dchen@nexusventures.co",
                    "phone": "+1 (555) 443-3322",
                    "company": "Nexus Ventures",
                    "stage": "Lead",
                    "value": 15000.0,
                    "status": "Active",
                    "tags": "Inbound, Cold"
                }
            ]

            for c_data in sample_customers:
                cust = crud.create_customer(db=db, customer_in=schemas.CustomerCreate(**c_data))
                if cust.name == "Sarah Jenkins":
                    crud.create_note(db=db, note_in=schemas.NoteCreate(
                        customer_id=cust.id,
                        content="Had initial demo call with Sarah. She liked the security compliance feature. Requested formal proposal by Friday.",
                        author="Alex Rivers",
                        sentiment="Positive",
                        category="Meeting"
                    ))
                    crud.create_note(db=db, note_in=schemas.NoteCreate(
                        customer_id=cust.id,
                        content="Sent proposal PDF ($45k annual). Follow-up scheduled for next Tuesday.",
                        author="Alex Rivers",
                        sentiment="Positive",
                        category="Email"
                    ))
                elif cust.name == "Marcus Vance":
                    crud.create_note(db=db, note_in=schemas.NoteCreate(
                        customer_id=cust.id,
                        content="Marcus expressed budget constraints regarding annual payment up-front. Exploring monthly billing option.",
                        author="Jordan Taylor",
                        sentiment="Negative",
                        category="Call"
                    ))
        yield
    finally:
        db.close()

app = FastAPI(
    title="AI-Powered Mini CRM API",
    description="Backend service for Sales Executives featuring Customer CRUD, Interaction Notes, and AI Sales Assistant.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(notes.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AI-Powered Mini CRM API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
