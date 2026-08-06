from a import feedback

file_path = "Tweets.csv"

useful_columns = [
    "text",
    "airline",
    "airline_sentiment"
]

feedback_column = "text"

# Step 1
df = feedback.clean(file_path, useful_columns, feedback_column)
print(df.head())

# Step 2
embeddings = feedback.create_embeddings(df)
print(embeddings.shape)

# Step 3
df = feedback.cluster(df, embeddings)
print(df["cluster"].value_counts())

# Step 4
groups = feedback.group_clusters(df, feedback_column)

print(f"Total clusters: {len(groups)}")

for group in groups[:3]:
    print("=" * 50)
    print("Cluster:", group["cluster"])
    print("Count:", group["count"])
    print("Sample comments:")
    for comment in group["comments"][:3]:
        print("-", comment)