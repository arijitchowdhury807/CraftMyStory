# import os
# import google.generativeai as genai

# # Configure Gemini with API Key from .env
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# def generate_content(prompt: str, language: str = "en", mode: str = "description") -> str:
#     """
#     Generates AI-powered content using Google's Gemini model.
    
#     Args:
#         prompt (str): The input prompt or product info.
#         language (str): Target language (default = English).
#         mode (str): Type of content ("description", "story", "social_post").
#     """
#     try:
#         model = genai.GenerativeModel("gemini-1.5-flash")

#         # Mode customization
#         if mode == "story":
#             system_prompt = f"Write a creative story in {language} for this artisan craft:\n{prompt}"
#         elif mode == "social_post":
#             system_prompt = f"Write a catchy social media post in {language} for this artisan product:\n{prompt}"
#         else:
#             system_prompt = f"Write a {language} product description for this artisan craft:\n{prompt}"

#         response = model.generate_content(system_prompt)
#         return response.text.strip()

#     except Exception as e:
#         return f"[Error generating content: {str(e)}]"

# from transformers import pipeline

# # Load HuggingFace pipeline once
# generator = pipeline("text-generation", model="distilgpt2")

# def generate_content(prompt: str, language: str = "en", mode: str = "description") -> str:
#     """
#     Generate content using HuggingFace Transformers (local).
#     Always generates in English (distilgpt2 limitation).
#     """
#     try:
#         if mode == "story":
#             system_prompt = f"Write a creative story in {language} for this artisan craft:\n{prompt}"
#         elif mode == "social_post":
#             system_prompt = f"Write a catchy social media post in {language} for this artisan product:\n{prompt}"
#         else:
#             system_prompt = f"Write a {language} product description for this artisan craft:\n{prompt}"

#         outputs = generator(system_prompt, max_length=200, num_return_sequences=1)
#         return outputs[0]["generated_text"].strip()
#     except Exception as e:
#         return f"[Error generating content: {str(e)}]"

# gcp_vertex.py
import os
from google import genai
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env")

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)

def generate_content(prompt: str, lang: str = "en", mode: str = "description") -> str:
    """
    Generate AI content using Gemini API based on a prompt.
    
    :param prompt: User input text (artisan craft description)
    :param lang: Language code for content (default "en")
    :param mode: Type of content (description, story, etc.)
    :return: Generated content as string
    """
    try:
        full_prompt = f"Write just a proper {lang} product {mode} without any extra fluff but in around 50-60 words for this artisan craft:\n{prompt}"
        response = client.models.generate_content(
            model="gemini-1.5-flash",   # You can change to any Gemini model
            contents=full_prompt
        )
        return response.text
    except Exception as e:
        return f"[Error generating content: {e}]"

# Example usage
# if __name__ == "__main__":
#     test_prompt = "This is a handmade candle"
#     result = generate_content(test_prompt, lang="en", mode="description")
#     print("Generated Content:\n", result)

