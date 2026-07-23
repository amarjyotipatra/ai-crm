from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    stage = Column(String(50), default="Lead", index=True)  # Lead, Contacted, Qualified, Proposal, Won, Lost
    value = Column(Float, default=0.0)
    status = Column(String(50), default="Active")  # Active, Inactive, Archived
    tags = Column(String(255), default="General")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    notes = relationship("Note", back_populates="customer", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    author = Column(String(100), default="Sales Rep")
    sentiment = Column(String(50), default="Neutral")  # Positive, Neutral, Negative
    category = Column(String(50), default="General")  # Call, Meeting, Email, General
    created_at = Column(DateTime(timezone=True), default=utc_now)

    customer = relationship("Customer", back_populates="notes")
