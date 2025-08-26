# generate_hindi_audio.py
from gtts import gTTS

# Dummy Hindi text for testing
text = "यह एक हस्तनिर्मित मोमबत्ती है"

# Convert text to speech
tts = gTTS(text, lang="hi")
tts.save("sample.wav")

print("✅ Hindi voice sample saved as sample.wav")
