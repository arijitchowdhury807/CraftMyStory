# generate_hindi_audio.py
from gtts import gTTS

# Dummy Hindi text for testing
text = "I am arijit chowdhury and I have made an oil painting using oil paints that costs upto 20 dollars."

# Convert text to speech
tts = gTTS(text, lang="hi")
tts.save("sample.wav")

print("✅ Hindi voice sample saved as sample.wav")
