# from services.gcp_translate import translate_text

# # Example: Hindi to English
# input_text = "नमस्ते, मेरा नाम अर्जुन है और मैं मिट्टी के बर्तन बनाता हूँ।"
# result = translate_text(input_text, target_lang="en")

# print("Translation Output:", result)

from deep_translator import GoogleTranslator
from gtts import gTTS
import os

def translate_hindi_to_english(hindi_text: str, speak: bool = True) -> str:
    english_text = GoogleTranslator(source="hi", target="mr").translate(hindi_text)

    print("Hindi Text   :", hindi_text)
    print("English Text :", english_text)

    # if speak:
    #     tts = gTTS(text=english_text, lang="en")
    #     tts.save("english_output.mp3")
    #     os.system("start english_output.mp3")  # use "open" on macOS, "xdg-open" on Linux

    return english_text


if __name__ == "__main__":
    hindi_input = "नमस्ते, मेरा नाम अर्जुन है और मैं मिट्टी के बर्तन बनाता हूँ।"
    translate_hindi_to_english(hindi_input)
