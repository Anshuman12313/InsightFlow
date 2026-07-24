from fastapi import FastAPI, UploadFile, File

from services import Service

app = FastAPI()


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    file_path = Service.save_csv(file)

    df = Service.load_dataframe(file_path)

    return {
        "file_path": file_path,
        "columns": Service.get_columns(df)
    }