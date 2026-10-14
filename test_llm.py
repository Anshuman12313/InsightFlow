import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

print("API key loaded:", api_key is not None)

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found")

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=api_key,
    temperature=0
)

response = llm.invoke("Explain LangChain in one sentence.")

print("Response:")
print(response.content)