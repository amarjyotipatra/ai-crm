from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(tags=["Customers"])

@router.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_new_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db=db, customer_in=customer)

@router.get("/customers", response_model=List[schemas.CustomerResponse])
def read_customers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search by name, email, or company"),
    stage: Optional[str] = Query(None, description="Filter by deal stage"),
    db: Session = Depends(get_db)
):
    return crud.get_customers(db=db, skip=skip, limit=limit, search=search, stage=stage)

@router.get("/customer/{id}", response_model=schemas.CustomerResponse)
@router.get("/customers/{id}", response_model=schemas.CustomerResponse)
def read_customer_by_id(id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer_by_id(db=db, customer_id=id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {id} not found."
        )
    return customer

@router.put("/customer/{id}", response_model=schemas.CustomerResponse)
@router.put("/customers/{id}", response_model=schemas.CustomerResponse)
def update_customer_by_id(id: int, customer_in: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    updated = crud.update_customer(db=db, customer_id=id, customer_in=customer_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {id} not found."
        )
    return updated

@router.delete("/customer/{id}", status_code=status.HTTP_200_OK)
@router.delete("/customers/{id}", status_code=status.HTTP_200_OK)
def delete_customer_by_id(id: int, db: Session = Depends(get_db)):
    success = crud.delete_customer(db=db, customer_id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {id} not found."
        )
    return {"message": f"Customer with ID {id} successfully deleted.", "id": id}
