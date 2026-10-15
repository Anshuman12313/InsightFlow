import os
from datetime import datetime,timedelta,timezone
import jwt
from pwdlib import PasswordHash
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")


if not SECRET_KEY:
    raise RuntimeError("secret key is missing from .env")

ALGORITHM="HS256"

password_hash=PasswordHash.recommended()

def hash_password(password:str)->str:
    return password_hash.hash(password)

def verify_password(password:str,hashed_password:str)->bool:
    return password_hash.verify(password,hashed_password)

def create_access_token(user_id:int)->str:
    payload={
        "sub":str(user_id),
        "exp":datetime.now(timezone.utc)+timedelta(minutes=30)
    }
    return jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)

def decode_access_token(token:str)->dict:
    return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])