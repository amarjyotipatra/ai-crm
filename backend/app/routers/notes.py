from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(tags=["Notes"])

@router.post("/notes", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
def create_customer_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    # Verify customer exists first
    customer = crud.get_customer_by_id(db=db, customer_id=note.customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cannot add note. Customer with ID {note.customer_id} does not exist."
        )
    return crud.create_note(db=db, note_in=note)

@router.get("/notes/{customer_id}", response_model=List[schemas.NoteResponse])
def read_notes_for_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )
    return crud.get_notes_by_customer(db=db, customer_id=customer_id)
