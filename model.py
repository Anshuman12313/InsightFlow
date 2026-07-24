from sentence_transformers import SentenceTransformer
import numpy as np
model=SentenceTransformer("all-MiniLM-L6-v2")
def encoding(df,text_column:str,save_path:str="embeddings.npy"):
    embeddings=model.encode(
      df[text_column].to_list(),
      batch_size=32,
      show_progress_bar=True,
      convert_to_numpy=True
    )
    np.save(save_path,embeddings)
