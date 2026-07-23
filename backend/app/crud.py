from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import Customer, Note
from app.schemas import CustomerCreate, CustomerUpdate, NoteCreate

# Customer Operations
def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    db_customer = Customer(**customer_in.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None, 
    stage: Optional[str] = None
) -> List[Customer]:
    query = db.query(Customer)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Customer.name.ilike(search_pattern),
                Customer.email.ilike(search_pattern),
                Customer.company.ilike(search_pattern)
            )
        )
    if stage and stage.lower() != "all":
        query = query.filter(Customer.stage.ilike(stage))
        
    return query.order_by(Customer.created_at.desc()).offset(skip).limit(limit).all()

def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()

def update_customer(db: Session, customer_id: int, customer_in: CustomerUpdate) -> Optional[Customer]:
    db_customer = get_customer_by_id(db, customer_id)
    if not db_customer:
        return None
    
    update_data = customer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_customer, field, value)
        
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int) -> bool:
    db_customer = get_customer_by_id(db, customer_id)
    if not db_customer:
        return False
    db.delete(db_customer)
    db.commit()
    return True

# Note Operations
def create_note(db: Session, note_in: NoteCreate) -> Note:
    # Basic sentiment heuristics if not explicitly passed
    sentiment = note_in.sentiment or "Neutral"
    content_lower = note_in.content.lower()
    if any(word in content_lower for word in ["excited", "great", "deal", "closed", "love", "agreed", "happy"]):
        sentiment = "Positive"
    elif any(word in content_lower for word in ["delayed", "concern", "issue", "budget", "expensive", "risk", "competitor"]):
        sentiment = "Negative"

    db_note = Note(
        customer_id=note_in.customer_id,
        content=note_in.content,
        author=note_in.author or "Sales Executive",
        sentiment=sentiment,
        category=note_in.category or "General"
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes_by_customer(db: Session, customer_id: int) -> List[Note]:
    return db.query(Note).filter(Note.customer_id == customer_id).order_by(Note.created_at.desc()).all()
