import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


# Find .env in the same directory as llm.py
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


def get_llm():

    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        raise ValueError(f"GOOGLE_API_KEY not found. Checked: {ENV_FILE}")

    return ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        google_api_key=api_key,
        temperature=0
    )


def generative_issue(comments):

    llm = get_llm()

    prompt = f"""
You are a customer feedback analyst.

Analyze the following customer feedback comments.

Identify the single common issue or topic shared by these comments.

Comments:
{comments}

Rules:
- Return only the issue name.
- Maximum 8 words.
- Do not explain your reasoning.
"""

    response = llm.invoke(prompt)

    return response.content[0]["text"]