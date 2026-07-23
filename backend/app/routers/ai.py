from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas, ai_service

router = APIRouter(prefix="/ai", tags=["AI Sales Features"])

@router.post("/generate-email", response_model=schemas.AIResponse)
def api_generate_email(payload: schemas.EmailGenRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer ID {payload.customer_id} not found")
    
    notes = crud.get_notes_by_customer(db=db, customer_id=payload.customer_id)
    email_text = ai_service.generate_followup_email(
        customer=customer, 
        notes=notes, 
        tone=payload.tone or "Professional", 
        objective=payload.objective or "Follow up"
    )
    return schemas.AIResponse(
        success=True,
        feature="generate_followup_email",
        result=email_text,
        metadata={"customer_id": customer.id, "tone": payload.tone}
    )

@router.post("/summarize-notes", response_model=schemas.AIResponse)
def api_summarize_notes(payload: schemas.SummaryRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer ID {payload.customer_id} not found")
    
    notes = crud.get_notes_by_customer(db=db, customer_id=payload.customer_id)
    summary = ai_service.summarize_customer_notes(customer=customer, notes=notes)
    return schemas.AIResponse(
        success=True,
        feature="summarize_customer_notes",
        result=summary,
        metadata={"customer_id": customer.id, "total_notes": len(notes)}
    )

@router.post("/next-best-action", response_model=schemas.AIResponse)
def api_next_best_action(payload: schemas.NextActionRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer ID {payload.customer_id} not found")
    
    notes = crud.get_notes_by_customer(db=db, customer_id=payload.customer_id)
    action = ai_service.generate_next_best_action(customer=customer, notes=notes)
    return schemas.AIResponse(
        success=True,
        feature="next_best_action",
        result=action,
        metadata={"customer_id": customer.id, "stage": customer.stage}
    )

@router.post("/meeting-summary", response_model=schemas.AIResponse)
def api_meeting_summary(payload: schemas.MeetingSummaryRequest, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer ID {payload.customer_id} not found")
    
    summary = ai_service.generate_meeting_summary(customer=customer, raw_transcript=payload.raw_transcript)
    return schemas.AIResponse(
        success=True,
        feature="meeting_summary",
        result=summary,
        metadata={"customer_id": customer.id}
    )
