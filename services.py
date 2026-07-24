import os
import shutil
import pandas as pd
class Services:
    UPLOAD_FOALDER = "uploads"
    @staticmethod
    def save_csv(file):
        os.makedirs(Services.UPLOAD_FOALDER,exits_ok=True)

        file_path=os.path.join(
            Services.UPLOAD_FOALDER,
           file.filename
        )

        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(file.file,buffer)

        return file_path
    @staticmethod
    def load_datafram(file_path):
        return pd.read_csv(file_path)

    @staticmethod
    def get_columns(df):
        return df.columns.tolist()