import pandas as pd

class Service:

    @staticmethod
    def analyze(filename, columns):

        path = f"uploads/{filename}"
        df = pd.read_csv(path)

        # You can use columns anywhere in this function
        print(columns)

        return {
            "selected_columns": columns
        }
    