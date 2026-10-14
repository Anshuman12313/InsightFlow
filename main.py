import os
import shutil

import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from a import feedback


os.makedirs("uploads", exist_ok=True)


app = FastAPI(title="Feedback Clustering API")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Helper: Convert NumPy/Pandas values to JSON-safe values
# --------------------------------------------------

def convert_numpy(value):
    """
    Convert NumPy/Pandas values into normal Python
    values that FastAPI can serialize to JSON.
    """

    # numpy.int64, numpy.float64, numpy.bool_, etc.
    if hasattr(value, "item"):
        return value.item()

    # Dictionary
    if isinstance(value, dict):
        return {
            key: convert_numpy(val)
            for key, val in value.items()
        }

    # List
    if isinstance(value, list):
        return [
            convert_numpy(item)
            for item in value
        ]

    # Tuple
    if isinstance(value, tuple):
        return [
            convert_numpy(item)
            for item in value
        ]

    return value


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
async def health_check():
    return {"status": "ok"}


# --------------------------------------------------
# Upload CSV
# --------------------------------------------------

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Check file type
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed."
        )

    file_path = f"uploads/{file.filename}"

    try:

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read CSV
        df = pd.read_csv(file_path)

    except pd.errors.EmptyDataError:

        raise HTTPException(
            status_code=400,
            detail="CSV file is empty."
        )

    except Exception:

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="Invalid CSV file."
        )

    # Check if CSV has rows
    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="CSV file has no rows."
        )

    # Get column names
    columns = df.columns.to_list()

    # Get first 5 rows
    preview = (
        df.head(5)
        .fillna("")
        .astype(str)
        .to_dict(orient="records")
    )

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "columns": columns,
        "row_count": len(df),
        "preview": preview,
    }


# --------------------------------------------------
# Analyze Request
# --------------------------------------------------

class Request(BaseModel):
    useful_columns: list[str]
    feedback_column: str
    file_name: str


# --------------------------------------------------
# Analyze CSV
# --------------------------------------------------

@app.post("/analyze")
async def give_columns(request: Request):

    file_path = f"uploads/{request.file_name}"

    # Check file exists
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found. Please upload again."
        )

    # Feedback column must be selected
    if request.feedback_column not in request.useful_columns:
        raise HTTPException(
            status_code=400,
            detail="Feedback column must be included in selected columns."
        )

    try:

        # ------------------------------------------
        # 1. Clean data
        # ------------------------------------------

        df = feedback.clean(
            file_path,
            request.useful_columns,
            request.feedback_column
        )

        total_records = len(df)

        if total_records == 0:
            raise HTTPException(
                status_code=400,
                detail="No valid feedback rows found after cleaning empty values."
            )

        # ------------------------------------------
        # 2. Create embeddings
        # ------------------------------------------

        embeddings = feedback.create_embeddings(df)

        # ------------------------------------------
        # 3. Clustering
        # ------------------------------------------

        df = feedback.cluster(
            df,
            embeddings
        )

        # ------------------------------------------
        # 4. Count noise
        # ------------------------------------------

        noise_count = int(
            (df["cluster"] == -1).sum()
        )

        # ------------------------------------------
        # 5. Group clusters
        # ------------------------------------------

        result = feedback.group_clusters(
            df,
            request.feedback_column
        )

        # Convert NumPy values inside result
        result = convert_numpy(result)

        # Sort clusters by count
        result.sort(
            key=lambda item: item["count"],
            reverse=True
        )

        # ------------------------------------------
        # 6. Create records
        # ------------------------------------------

        metadata_columns = [
            column
            for column in request.useful_columns
            if column != request.feedback_column
        ]

        records = []

        for _, row in df.iterrows():

            record = {
                "text": str(
                    row[request.feedback_column]
                ),
                "cluster": int(
                    row["cluster"]
                ),
            }

            if metadata_columns:

                record["metadata"] = {}

                for column in metadata_columns:

                    value = row[column]

                    # Missing value
                    if pd.isna(value):

                        record["metadata"][column] = None

                    # NumPy value
                    elif hasattr(value, "item"):

                        record["metadata"][column] = value.item()

                    # Normal Python value
                    else:

                        record["metadata"][column] = value

            records.append(record)

        # ------------------------------------------
        # 7. Convert everything once more
        # ------------------------------------------

        response = {
            "total_records": total_records,
            "noise_count": noise_count,
            "total_clusters": len(result),
            "clusters": result,
            "records": records,
            "filename": request.file_name,
            "feedback_column": request.feedback_column,
        }

        response = convert_numpy(response)

        return response

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        print("Analysis error:", exc)

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {exc}"
        )