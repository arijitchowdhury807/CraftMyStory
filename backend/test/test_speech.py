# from services.gcp_speech import transcribe_audio

# AUDIO_FILE = "./converted.wav"
# result = transcribe_audio("./converted.wav", language_code="en-IN")
# print("Speech-to-Text Output:", result)

# # import wave
# # import contextlib

# # file_path = "./converted.wav"

# # with contextlib.closing(wave.open(file_path, 'r')) as f:
# #     channels = f.getnchannels()
# #     sample_rate = f.getframerate()
# #     sampwidth = f.getsampwidth()
# #     frames = f.getnframes()
# #     duration = frames / float(sample_rate)

# # print(f"Channels: {channels}, Sample Rate: {sample_rate}, Sample Width: {sampwidth}, Duration: {duration:.2f}s")

# import speech_recognition as sr

# def speech_to_text():
#     # Initialize recognizer
#     recognizer = sr.Recognizer()

#     with sr.Microphone() as source:
#         print("🎤 Speak something...")
#         recognizer.adjust_for_ambient_noise(source)  # optional, reduces noise
#         audio = recognizer.listen(source)

#     try:
#         # Use Google Web Speech API (free, requires internet)
#         text = recognizer.recognize_google(audio, language="hi-IN")  # or "en-IN"
#         print("You said:", text)
#         return text
#     except sr.UnknownValueError:
#         return "[Error: Could not understand audio]"
#     except sr.RequestError as e:
#         return f"[Error: Could not request results; {e}]"


# if __name__ == "__main__":
#     result = speech_to_text()
#     print("Final Text:", result)

import speech_recognition as sr

def speech_file_to_text(audio_path: str, language: str = "hi-IN") -> str:
    """
    Convert a voice/audio file to text.

    :param audio_path: Path to the audio file (wav, mp3, etc.)
    :param language: Language code (default Hindi "hi-IN")
    :return: Transcribed text
    """
    recognizer = sr.Recognizer()
    
    # Load audio file
    try:
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)  # read the entire file
    except Exception as e:
        return f"[Error loading audio file: {str(e)}]"

    # Recognize speech using Google Web Speech API
    try:
        text = recognizer.recognize_google(audio, language=language)
        print("Transcribed Text:", text)
        return text
    except sr.UnknownValueError:
        return "[Error: Could not understand audio]"
    except sr.RequestError as e:
        return f"[Error: Could not request results; {e}]"


if __name__ == "__main__":
    audio_file = "./temp/converted.wav"  # Replace with your audio file path
    result = speech_file_to_text(audio_file)
