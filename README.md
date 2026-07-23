# 🚀 NexusCRM - AI-Powered Mini CRM Monorepo

> **NexusCRM** is an enterprise-grade AI-powered Customer Relationship Management (CRM) platform specifically designed for modern sales executives. Built as a unified monorepo featuring a high-performance **Python FastAPI** backend, a stunning glassmorphic **React.js** frontend, **SQLAlchemy** DB layer (SQLite & PostgreSQL compatible), and an integrated **Google Gemini AI Sales Assistant**.

---

## 🌟 Overview & Standout Modifications

This project fulfills all core specifications and includes advanced features to demonstrate software engineering craftsmanship:

### Required API Endpoints Implemented
- `POST /customers` - Create customer profile
- `GET /customers` - List customers with search, pagination, and stage filtering
- `GET /customer/{id}` & `GET /customers/{id}` - Fetch single customer details
- `PUT /customer/{id}` & `PUT /customers/{id}` - Update customer profile & stage
- `DELETE /customer/{id}` & `DELETE /customers/{id}` - Remove customer record
- `POST /notes` - Add interaction notes for a customer
- `GET /notes/{customer_id}` - Retrieve customer notes

### Required React Frontend Pages & Views
- 🔑 **Dummy Login Page**: Fast 1-click preset login accounts (Sales Executive, VP Sales) or custom session initialization.
- 📊 **Customer Directory / List View**: Table and Kanban board views with search, stage filters, and real-time metrics.
- 👤 **Customer Details Hub**: Complete profile view, pipeline stage badge, estimated value counter, and lead score.
- ✏️ **Add & Edit Customer Drawers**: Interactive modals for seamless profile management.
- 📝 **Customer Notes Manager**: Rich note logger with automated sentiment categorization (Positive, Neutral, Negative).
- 🕒 **Interactive Activity Timeline**: Chronological visual history tracking customer creation, notes, and AI milestones.

### AI Sales Assistant Engine Features
1. ✉️ **Follow-up Email Generator**: Crafts personalized sales emails with selectable tones (*Professional, Urgent, Warm & Friendly, Re-engagement*) and custom goal objectives.
2. 📄 **Customer Notes Summarizer**: Generates executive-level relationship digests, sentiment breakdowns, and pain points.
3. 🎯 **Next Best Action Recommender**: Calculates deal win probabilities and strategic next execution steps based on pipeline stage.
4. 🎙️ **Meeting Summary Converter**: Converts raw meeting transcripts or unorganized sync notes into structured action items.

---

## 🏗️ Monorepo Architecture

```
ai-mini-crm/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application, CORS, and seed data initializer
│   │   ├── database.py          # SQLAlchemy engine (SQLite & PostgreSQL support)
│   │   ├── models.py            # Customer & Note ORM models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── crud.py              # Database query operations & sentiment heuristic engine
│   │   ├── ai_service.py        # Gemini 2.5 Flash SDK integration & smart offline fallback
│   │   └── routers/
│   │       ├── customers.py     # Customer CRUD endpoints (singualr & plural URI aliases)
│   │       ├── notes.py         # Customer notes endpoints
│   │       └── ai.py            # AI Sales Assistant endpoints
│   ├── tests/
│   │   ├── test_customers.py    # Pytest unit tests for Customer CRUD
│   │   ├── test_notes.py        # Pytest unit tests for Notes
│   │   └── test_ai.py           # Pytest unit tests for AI features
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios client for API endpoints
│   │   ├── context/AuthContext.jsx # Dummy authentication state management
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with user session & quick metrics
│   │   │   ├── CustomerModal.jsx # Add / Edit Customer modal
│   │   │   ├── NoteModal.jsx     # Add Note modal
│   │   │   ├── TimelineView.jsx # Visual activity timeline component
│   │   │   └── AISalesHub.jsx   # Dedicated AI Assistant studio drawer
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx    # Glassmorphism login page
│   │   │   ├── CustomerList.jsx # Interactive list/kanban directory with search & filters
│   │   │   └── CustomerDetails.jsx # Customer workspace hub
│   │   ├── index.css            # Custom glassmorphic design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml           # Single-command startup orchestration
├── .env.example
└── README.md
```

---

## ⚡ Quickstart & Setup Guide

### Option A: Running with Docker Compose (Recommended - Single Command)

To launch both the backend and frontend simultaneously with a single command:

```bash
docker-compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Service**: [http://localhost:8000](http://localhost:8000)
- **Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Running Locally (Manual Setup)

#### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (React / Vite)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

---

## 🧪 Running Unit Tests

Backend unit tests are written with `pytest` using an isolated in-memory SQLite database:

```bash
cd backend
pytest -v
```

Expected test output:
- `test_customers.py`: Verifies Customer creation, listing, single fetch (singular/plural routes), update, and deletion.
- `test_notes.py`: Verifies Note creation, sentiment tagging, and customer note queries.
- `test_ai.py`: Verifies email generation, note summarization, next best action calculation, and transcript parsing.

---

## 🤖 AI Prompts Used

The application utilizes Google Gemini (`gemini-2.5-flash`) via the `google-genai` SDK. Below are the prompts engineered into `backend/app/ai_service.py`:

### 1. Follow-up Email Generator Prompt
```text
You are an expert enterprise sales executive AI assistant. Write a high-converting follow-up email to a customer.

Customer Details:
- Name: {customer.name}
- Company: {customer.company}
- Stage: {customer.stage}
- Deal Value: ${customer.value}

Recent Notes & Interaction Context:
{notes_summary}

Email Goal/Objective: {objective}
Desired Tone: {tone}

Requirements:
- Subject Line included
- Professional, engaging, and personal
- Clear call-to-action (CTA)
- Signed off by 'Sales Executive'
```

### 2. Customer Notes Summarizer Prompt
```text
Summarize the following customer notes for executive review.

Customer: {customer.name} ({customer.company})
Current Deal Stage: {customer.stage}

Customer Notes History:
{notes_text}

Provide an Executive Summary containing:
1. Key Deal Highlights & Relationship Health
2. Main Customer Concerns / Pain Points
3. Sentiment Analysis Overview
4. Key Action Items
```

### 3. Next Best Action Engine Prompt
```text
You are a strategic AI Sales Manager. Analyze the customer status and recommend the Next Best Action.

Customer Name: {customer.name}
Company: {customer.company}
Stage: {customer.stage}
Deal Value: ${customer.value}
Recent Activity:
{notes_text}

Output structure:
- Recommended Strategic Action
- Priority Level (High / Medium / Low)
- Deal Win Probability Estimation (%)
- Key Reasoning & Risk Mitigation
```

### 4. Meeting Summary Converter Prompt
```text
Transform the following raw meeting transcript/notes into a structured meeting summary for CRM record-keeping.

Customer: {customer.name} ({customer.company})

Raw Transcript / Meeting Notes:
{raw_transcript}

Please structure into:
1. Executive Meeting Overview
2. Key Topics Discussed
3. Customer Pain Points & Feedback
4. Next Steps & Assigned Action Items
```

---

## ⚖️ Tradeoffs & Known Limitations

### Technical Tradeoffs
1. **SQLite vs PostgreSQL**:
   - *Choice*: SQLite is configured by default for zero-config immediate execution.
   - *Tradeoff*: SQLite does not support high concurrent write loads as well as PostgreSQL. However, setting the `DATABASE_URL` environment variable to a PostgreSQL connection string instantly switches SQLAlchemy to PostgreSQL without code modifications.
2. **Built-In Smart AI Fallback Generator**:
   - *Choice*: When `GEMINI_API_KEY` is not present or offline, a heuristic response generator automatically crafts structured responses.
   - *Tradeoff*: Fallback responses are template-based rather than fully generative, but this ensures 100% application uptime and reliable test execution.
3. **Dummy Authentication**:
   - *Choice*: Frontend dummy auth state simulates realistic sales rep sessions without introducing JWT server overhead.
   - *Tradeoff*: Suitable for demonstration and staging; production deployments should integrate OAuth2/JWT auth middleware.

### Known Limitations
- Real-time WebSockets notification streams for live multi-user editing are omitted for simplicity.
- Attachment uploads for customer note PDFs are currently stored as plain text.

---

## 💡 Skill Demonstrations & Extra Modifications
- **Unified Monorepo Architecture**: Clean separation of concerns between backend services and frontend React components.
- **Glassmorphism Dark Aesthetics**: Premium UI with HSL dark mode background, neon glows, polished typography, and interactive micro-animations.
- **Dual View Directory**: Toggle seamlessly between tabular list format and interactive Kanban board cards.
- **Dual URI Route Support**: Handles both singular (`/customer/{id}`) and plural (`/customers/{id}`) REST routes for developer friendliness.
