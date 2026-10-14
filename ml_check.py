import numpy as np
import pandas as pd

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

import umap
import hdbscan


# ============================================================
# CONFIG
# ============================================================

FILE_PATH = "uploads/Tweets.csv"
TEXT_COLUMN = "text"


# ============================================================
# 1. LOAD DATA
# ============================================================

print("\n========== LOADING DATA ==========\n")

df = pd.read_csv(FILE_PATH)

print("Original shape:", df.shape)

print("Columns:")
print(df.columns.tolist())


# ============================================================
# 2. CLEAN DATA
# ============================================================

print("\n========== CLEANING DATA ==========\n")

df = df.dropna(subset=[TEXT_COLUMN])

df = df[
    df[TEXT_COLUMN]
    .astype(str)
    .str.strip()
    != ""
]

df["clean_text"] = (
    df[TEXT_COLUMN]
    .astype(str)
    .str.lower()
    .str.replace(r"http\S+", "", regex=True)
    .str.replace(r"@\w+", "", regex=True)
    .str.replace(r"#", "", regex=False)
    .str.replace(r"[^a-z0-9\s]", " ", regex=True)
    .str.replace(r"\s+", " ", regex=True)
    .str.strip()
)

print("After cleaning:", len(df))

print("\nExample cleaned tweets:\n")

for text in df["clean_text"].head(5):
    print(text)


# ============================================================
# 3. CREATE EMBEDDINGS
# ============================================================

print("\n========== CREATING EMBEDDINGS ==========\n")

model = SentenceTransformer("all-MiniLM-L6-v2")

embeddings = model.encode(
    df["clean_text"].tolist(),
    batch_size=32,
    show_progress_bar=True,
    convert_to_numpy=True
)

print("\nEmbedding shape:", embeddings.shape)


# ============================================================
# 4. CHECK EMBEDDING SIMILARITY
# ============================================================

print("\n========== EMBEDDING SIMILARITY ==========\n")

sample = embeddings[:1000]

similarity = cosine_similarity(sample)

upper = similarity[
    np.triu_indices_from(similarity, k=1)
]

print(
    "Mean cosine similarity:",
    upper.mean()
)

print(
    "Min cosine similarity:",
    upper.min()
)

print(
    "Max cosine similarity:",
    upper.max()
)


# ============================================================
# 5. NORMALIZE EMBEDDINGS
# ============================================================

print("\n========== NORMALIZING EMBEDDINGS ==========\n")

normalized_embeddings = normalize(embeddings)

print(
    "Normalized shape:",
    normalized_embeddings.shape
)


# ============================================================
# 6. UMAP
# ============================================================

print("\n========== UMAP ==========\n")

reducer = umap.UMAP(
    n_neighbors=30,
    n_components=10,
    min_dist=0.0,
    metric="cosine",
    random_state=42
)

reduced_embeddings = reducer.fit_transform(
    normalized_embeddings
)

print(
    "UMAP shape:",
    reduced_embeddings.shape
)


# ============================================================
# 7. HDBSCAN EXPERIMENT
# ============================================================

print("\n========== HDBSCAN EXPERIMENT ==========\n")

hdbscan_settings = [
    (30, 5),
    (30, 10),
    (30, 15),
    (30, 20),
    (50, 10),
    (50, 15),
    (50, 20),
    (75, 15),
    (100, 20),
]

for min_cluster_size, min_samples in hdbscan_settings:

    print(
        f"\n--- min_cluster_size={min_cluster_size}, "
        f"min_samples={min_samples} ---"
    )

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=min_cluster_size,
        min_samples=min_samples,
        metric="euclidean",
        cluster_selection_method="eom"
    )

    labels = clusterer.fit_predict(
        reduced_embeddings
    )

    unique, counts = np.unique(
        labels,
        return_counts=True
    )

    noise_count = int(
        (labels == -1).sum()
    )

    cluster_sizes = [
        count
        for cluster, count in zip(unique, counts)
        if cluster != -1
    ]

    num_clusters = len(cluster_sizes)

    largest_cluster = (
        max(cluster_sizes)
        if cluster_sizes
        else 0
    )

    print("Clusters:", num_clusters)

    print("Noise:", noise_count)

    print(
        "Noise %:",
        round(
            noise_count / len(labels) * 100,
            2
        )
    )

    print(
        "Largest cluster:",
        largest_cluster
    )


# ============================================================
# 8. K-MEANS EXPERIMENT
# ============================================================

print("\n========== K-MEANS EXPERIMENT ==========\n")

k_values = [10, 15, 20, 25, 30]

for k in k_values:

    print(f"\n--- K = {k} ---")

    kmeans = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )

    labels = kmeans.fit_predict(
        reduced_embeddings
    )

    unique, counts = np.unique(
        labels,
        return_counts=True
    )

    # ----------------------------------------
    # Silhouette score
    # ----------------------------------------

    silhouette = silhouette_score(
        reduced_embeddings,
        labels
    )

    print(
        "Silhouette score:",
        round(silhouette, 4)
    )

    # ----------------------------------------
    # Cluster statistics
    # ----------------------------------------

    print(
        "Largest cluster:",
        max(counts)
    )

    print(
        "Smallest cluster:",
        min(counts)
    )

    print(
        "Average cluster size:",
        round(counts.mean(), 2)
    )

    # ----------------------------------------
    # Cluster distribution
    # ----------------------------------------

    print("\nCluster sizes:")

    for cluster, count in sorted(
        zip(unique, counts),
        key=lambda x: x[1],
        reverse=True
    ):

        percentage = (
            count / len(labels)
        ) * 100

        print(
            f"  Cluster {cluster}: "
            f"{count} "
            f"({percentage:.2f}%)"
        )


# ============================================================
# 9. BEST K-MEANS CLUSTER DETAILS
# ============================================================

print("\n========== K-MEANS SUMMARY ==========\n")

best_k = None
best_score = -1

for k in k_values:

    kmeans = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )

    labels = kmeans.fit_predict(
        reduced_embeddings
    )

    score = silhouette_score(
        reduced_embeddings,
        labels
    )

    if score > best_score:
        best_score = score
        best_k = k

print(
    "Best K based on silhouette:",
    best_k
)

print(
    "Best silhouette score:",
    round(best_score, 4)
)


# ============================================================
# 10. FINAL K-MEANS CLUSTER EXAMPLES
# ============================================================

print("\n========== SAMPLE TWEETS FROM BEST K ==========\n")

kmeans = KMeans(
    n_clusters=best_k,
    random_state=42,
    n_init=10
)

labels = kmeans.fit_predict(
    reduced_embeddings
)

df["kmeans_cluster"] = labels

for cluster_id in range(best_k):

    cluster_df = df[
        df["kmeans_cluster"] == cluster_id
    ]

    print("\n")
    print("=" * 70)

    print(
        f"CLUSTER {cluster_id} "
        f"({len(cluster_df)} records)"
    )

    print("=" * 70)

    samples = cluster_df[
        TEXT_COLUMN
    ].head(5)

    for i, text in enumerate(samples, 1):

        print(
            f"{i}. {text}"
        )


# ============================================================
# 11. FINAL SUMMARY
# ============================================================

print("\n")
print("=" * 70)
print("FINAL SUMMARY")
print("=" * 70)

print(
    "Total records:",
    len(df)
)

print(
    "Embedding dimensions:",
    embeddings.shape[1]
)

print(
    "UMAP dimensions:",
    reduced_embeddings.shape[1]
)

print(
    "Best K:",
    best_k
)

print(
    "Best silhouette:",
    round(best_score, 4)
)

print("\nHDBSCAN and K-Means experiments completed.")