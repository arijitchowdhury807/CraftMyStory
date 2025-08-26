import os
import google.generativeai as genai

# Configure Gemini with API Key from .env
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_content(prompt: str, language: str = "en", mode: str = "description") -> str:
    """
    Generates AI-powered content using Google's Gemini model.
    
    Args:
        prompt (str): The input prompt or product info.
        language (str): Target language (default = English).
        mode (str): Type of content ("description", "story", "social_post").
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Mode customization
        if mode == "story":
            system_prompt = f"Write a creative story in {language} for this artisan craft:\n{prompt}"
        elif mode == "social_post":
            system_prompt = f"Write a catchy social media post in {language} for this artisan product:\n{prompt}"
        else:
            system_prompt = f"Write a {language} product description for this artisan craft:\n{prompt}"

        response = model.generate_content(system_prompt)
        return response.text.strip()

    except Exception as e:
        return f"[Error generating content: {str(e)}]"
