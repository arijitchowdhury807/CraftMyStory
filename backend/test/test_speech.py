from services.gcp_speech import transcribe_audio

AUDIO_FILE = "./converted.wav"
result = transcribe_audio("./converted.wav", language_code="en-IN")
print("Speech-to-Text Output:", result)

# import wave
# import contextlib

# file_path = "./converted.wav"

# with contextlib.closing(wave.open(file_path, 'r')) as f:
#     channels = f.getnchannels()
#     sample_rate = f.getframerate()
#     sampwidth = f.getsampwidth()
#     frames = f.getnframes()
#     duration = frames / float(sample_rate)

# print(f"Channels: {channels}, Sample Rate: {sample_rate}, Sample Width: {sampwidth}, Duration: {duration:.2f}s")
