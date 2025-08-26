from services.gcp_translate import translate_text

# Example: Hindi to English
input_text = "नमस्ते, मेरा नाम अर्जुन है और मैं मिट्टी के बर्तन बनाता हूँ।"
result = translate_text(input_text, target_lang="en")

print("Translation Output:", result)
