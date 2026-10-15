from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from user import UserCreate,UserLogin
from security import(
    hash_password,
    verify_password,
    create_access_token
)
from database import Base,engine
Base.metadata.create_all(bind=engine)
from fastapi import FastAPI
app=FastAPI()
router=APIRouter(prefix="/auth",tags=["Authentication"])
app.include_router(router)
@router.post("/register",status_code=201)
def register(user:UserCreate,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(
        User.username==user.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )
    new_user=User(
        username=user.username,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()
        raise

    return{
        "message":"Registration successful",
        "user_id":new_user.id
    }

@router.post("/login")
def login(user:UserLogin,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(
        User.username==user.username
    ).first()
    if(
        not existing_user
        or not verify_password(
            user.password,existing_user.hashed_password
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )
    token=create_access_token(existing_user.id)
    return{
        "access_token":token,
         "token_type":"bearer"
            }