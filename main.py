from fastapi import FastAPI, UploadFile, File
import shutil
import pandas as pd
from pydantic import BaseModel
from services import Service
app = FastAPI()
@app.post("/upload")
async def upload_file(file:UploadFile=File(...)):
    file_path=f"uploads/{file.filename}"
    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
    df=pd.read_csv(file_path)
    columns=df.columns.to_list()
    return {"message":"File uploaded successfully","filename":file.filename,"columns":columns}

class Request(BaseModel):
    filename:str
    columns:list[str]
    comment_column:str

@app.post("/analyze")
async def analyze(request:Request):
    result=Service.analyze(
        filename=request.filename,
        columns=request.columns,
        comment_column=request.columns
    )
    return result
