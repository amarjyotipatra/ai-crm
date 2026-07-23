from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Note Schemas
class NoteBase(BaseModel):
    content: str = Field(..., min_length=1, description="Content of the customer note")
    author: Optional[str] = "Sales Executive"
    sentiment: Optional[str] = "Neutral"
    category: Optional[str] = "General"

class NoteCreate(NoteBase):
    customer_id: int

class NoteResponse(NoteBase):
    id: int
    customer_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Customer Schemas
class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    stage: Optional[str] = "Lead"
    value: Optional[float] = 0.0
    status: Optional[str] = "Active"
    tags: Optional[str] = "General"

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[float] = None
    status: Optional[str] = None
    tags: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    model_config = ConfigDict(from_attributes=True)

# AI Payload Schemas
class EmailGenRequest(BaseModel):
    customer_id: int
    tone: Optional[str] = "Professional"  # Professional, Urgent, Friendly, Re-engagement
    objective: Optional[str] = "Follow up after initial demo"

class SummaryRequest(BaseModel):
    customer_id: int

class NextActionRequest(BaseModel):
    customer_id: int

class MeetingSummaryRequest(BaseModel):
    customer_id: int
    raw_transcript: str = Field(..., min_length=5, description="Meeting transcript or raw rough notes")

class AIResponse(BaseModel):
    success: bool = True
    feature: str
    result: str
    metadata: Optional[dict] = None
