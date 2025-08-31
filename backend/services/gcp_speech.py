# import io
# import os
# import wave
# import subprocess
# from google.cloud import speech_v1p1beta1 as speech

# def convert_to_linear16(file_path: str, target_path: str = "temp_converted.wav"):
#     """Force convert audio into LINEAR16, 16kHz mono using ffmpeg (if available)."""
#     cmd = [
#         "ffmpeg", "-y",
#         "-i", file_path,
#         "-ac", "1",          # mono
#         "-ar", "16000",      # 16kHz
#         "-sample_fmt", "s16",  # 16-bit PCM
#         target_path
#     ]
#     subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
#     return target_path


# def get_audio_duration(file_path: str) -> float:
#     """Return duration of WAV file in seconds."""
#     with wave.open(file_path, "rb") as wf:
#         frames = wf.getnframes()
#         rate = wf.getframerate()
#         return frames / float(rate)


# def transcribe_audio(file_path: str, language_code: str = "en-US") -> str:
#     """Convert then transcribe audio using Google Cloud Speech-to-Text."""
#     client = speech.SpeechClient()

#     # Ensure correct format
#     converted_path = convert_to_linear16(file_path)

#     # Read audio
#     with io.open(converted_path, "rb") as audio_file:
#         content = audio_file.read()

#     audio = speech.RecognitionAudio(content=content)
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=16000,
#         language_code="hi-IN",   # ✅ strict Hindi output
#         enable_automatic_punctuation=True,
#         max_alternatives=3       # ✅ gives multiple variations to choose from
#     )

#     # Check duration
#     duration = get_audio_duration(converted_path)

#     if duration < 55:  # short file, use immediate API
#         response = client.recognize(config=config, audio=audio)
#     else:  # longer file, use async
#         operation = client.long_running_recognize(config=config, audio=audio)
#         response = operation.result(timeout=600)  # wait up to 10 min

#     text = " ".join([result.alternatives[0].transcript for result in response.results])
#     return text.strip()

import speech_recognition as sr
from pydub import AudioSegment
import os

def convert_to_wav(input_path: str, output_path: str = "temp.wav") -> str:
    """
    Converts any audio file (.mp3, .webm, .opus, etc.) to PCM WAV (s16le).
    This ensures compatibility with SpeechRecognition.
    """
    try:
        sound = AudioSegment.from_file(input_path)  # auto-detect format
        # Force 16-bit PCM, mono channel, 16kHz (works best for STT)
        sound = sound.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        sound.export(output_path, format="wav")
        return output_path
    except Exception as e:
        raise RuntimeError(f"Error converting {input_path} to WAV: {str(e)}")

def transcribe_audio(file_path: str, language_code: str = "hi-IN") -> str:
    """
    Transcribes audio using SpeechRecognition.
    Converts any format to PCM WAV first.
    """
    recognizer = sr.Recognizer()

    # Convert if not WAV
    if not file_path.lower().endswith(".wav"):
        try:
            file_path = convert_to_wav(file_path)
        except Exception as e:
            return f"[Error converting file: {str(e)}]"
    else:
        # Even if .wav, force re-convert to PCM (in case it's compressed WAV)
        file_path = convert_to_wav(file_path)

    # Load audio file
    try:
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
    except Exception as e:
        return f"[Error loading audio file: {str(e)}]"

    # Recognize speech using Google Web Speech API
    try:
        text = recognizer.recognize_google(audio, language=language_code)
        return text.strip()
    except sr.UnknownValueError:
        return "[Error: Could not understand audio]"
    except sr.RequestError as e:
        return f"[Error: Could not request results; {e}]"

# # Example usage
# if __name__ == "__main__":
#     audio_file = "../temp/painting_voice2.wav"  # can be .wav, .mp3, .opus, .webm
#     result = transcribe_audio(audio_file, language_code="en-IN")
#     print("Transcribed Text:", result)
