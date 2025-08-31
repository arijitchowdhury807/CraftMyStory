# from services.gcp_vertex import generate_content

# # Example: Generate SEO description from artisan’s translated text
# prompt = "Generate a short SEO-friendly product description for clay pottery made by an artisan in Rajasthan."
# result = generate_content(prompt)

# print("Vertex AI Output:", result)

import os
from google import genai
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

def generate_content(prompt: str, model: str = "gemini-1.5-flash") -> str:
    """
    Generate AI content using Google Gemini API based on user prompt.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "[Error: GOOGLE_API_KEY not found in .env]"

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"[Error generating content: {str(e)}]"


if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    output = generate_content(user_prompt)
    print("\nGenerated Content:\n", output)
