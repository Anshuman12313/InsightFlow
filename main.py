from fastapi import FastAPI, UploadFile, File
import shutil
import pandas as pd
from pydantic import BaseModel
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
    columns:list[str]

# @app.post("/upload")
# async def upload_file(file:UploadFile=File(...)):
#     file_path=f"uploads/{file.filename}"
#     with open(file_path,"wb") as buffer:
#         shutil.copyfileobj(file.file,buffer)

#     df=pd.read_csv(file_path)
#     return{
#         "columns":df.columns.to_list()
#     }

@app.post("/Get_Column")
async def give_columns(columns:Request):
    return{
        "selected_columns":columns.columns
    }




