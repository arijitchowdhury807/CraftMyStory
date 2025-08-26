from google.cloud import translate_v2 as translate

translate_client = translate.Client()

def translate_text(text: str, target_lang: str = "en") -> str:
    """
    Translate text into the target language.
    """
    result = translate_client.translate(text, target_language=target_lang)
    return result["translatedText"]
