import io
import os
import wave
import subprocess
from google.cloud import speech_v1p1beta1 as speech

def convert_to_linear16(file_path: str, target_path: str = "temp_converted.wav"):
    """Force convert audio into LINEAR16, 16kHz mono using ffmpeg (if available)."""
    cmd = [
        "ffmpeg", "-y",
        "-i", file_path,
        "-ac", "1",          # mono
        "-ar", "16000",      # 16kHz
        "-sample_fmt", "s16",  # 16-bit PCM
        target_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return target_path


def get_audio_duration(file_path: str) -> float:
    """Return duration of WAV file in seconds."""
    with wave.open(file_path, "rb") as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)


def transcribe_audio(file_path: str, language_code: str = "en-US") -> str:
    """Convert then transcribe audio using Google Cloud Speech-to-Text."""
    client = speech.SpeechClient()

    # Ensure correct format
    converted_path = convert_to_linear16(file_path)

    # Read audio
    with io.open(converted_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="hi-IN",   # ✅ strict Hindi output
        enable_automatic_punctuation=True,
        max_alternatives=3       # ✅ gives multiple variations to choose from
    )

    # Check duration
    duration = get_audio_duration(converted_path)

    if duration < 55:  # short file, use immediate API
        response = client.recognize(config=config, audio=audio)
    else:  # longer file, use async
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=600)  # wait up to 10 min

    text = " ".join([result.alternatives[0].transcript for result in response.results])
    return text.strip()
