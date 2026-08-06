class feedback:
    #cleaning code
    @staticmethod
    def clean(file_path:str,useful_columns:list[str],feedback_column:str):
        import pandas as pd
        df=pd.read_csv(file_path)
        #checking for missing columns
        missing=[cols for cols in useful_columns if cols not in df.columns]
        if missing:
            raise ValueError(F"Missing columns:{missing}")
        new_df=df[useful_columns].copy()
        new_df=new_df.dropna(subset=[feedback_column])
        new_df=new_df[new_df[feedback_column].str.strip()!=""]
        new_df['word_count']=(new_df[feedback_column].str.split().str.len())
        new_df["clean_text"] = (
        new_df[feedback_column]
        .str.lower()
        .str.replace(r"http\S+", "", regex=True)
        .str.replace(r"@\w+", "", regex=True)
        .str.replace(r"#", "", regex=False)
        .str.replace(r"[^a-z0-9\s]", " ", regex=True)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
        )
        return new_df
    @staticmethod
    def create_embeddings(df):
        from sentence_transformers import SentenceTransformer
        import numpy as np
        model=SentenceTransformer("all-MiniLM-L6-v2")
        embeddings=model.encode(
            df["clean_text"].tolist(),
            batch_size=32,
            show_progress_bar=True,
            convert_to_numpy=True
        )
        np.save("embeddings.npy",embeddings)
        return embeddings
    @staticmethod
    def cluster(df,embeddings):
        import umap
        reducer=umap.UMAP(
            n_neighbors=15,
            n_components=50,
            metric="cosine",
            random_state=42
        )
        import numpy as np
        # embeddings = np.load("embeddings.npy")
        reduced_embeddings=reducer.fit_transform(embeddings)
        import hdbscan
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=30,
            metric="euclidean",
            prediction_data=True
        )
        labels = clusterer.fit_predict(reduced_embeddings)
        df["cluster"]=labels
        return df
    @staticmethod
    def group_clusters(df,feedback_column):
        clusters=df["cluster"].unique()
        result=[]
        clusters=[c for c in clusters if c!=-1]
        for cluster_id in clusters:
            cluster_df=df[df["cluster"]==cluster_id]
            comments=cluster_df[feedback_column].tolist()

            result.append({
                "cluster":cluster_id,
                "count":len(comments),
                "comments":comments
            })
        return result




    