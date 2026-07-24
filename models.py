from pydantic import BaseModel
class AnalyzeRequest(BaseModel):
    file_path:str
    comment_column:str
    metadata_columns:list[str]=[]
