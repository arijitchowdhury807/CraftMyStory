# from google.cloud import translate_v2 as translate

# translate_client = translate.Client()

# def translate_text(text: str, target_lang: str = "en") -> str:
#     """
#     Translate text into the target language.
#     """
#     result = translate_client.translate(text, target_language=target_lang)
#     return result["translatedText"]

from deep_translator import GoogleTranslator

def translate_text(text: str, target_lang: str = "en") -> str:
    """
    Translate text into the target language using deep-translator.
    Supports many languages reliably without coroutine issues.
    """
    try:
        if not text or text.strip() == "":
            return ""
        
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return translated.strip()
    except Exception as e:
        return f"[Error translating text: {str(e)}]"
    
# result = translate_text("नमस्ते, मेरा नाम अर्जुन है और मैं मिट्टी के बर्तन बनाता हूँ।", target_lang="en")
# print(result)