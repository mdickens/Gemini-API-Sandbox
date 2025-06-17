from google import genai
from google.genai import types
import pyaudio # You'll need to install PyAudio

client = genai.Client(api_key="GEMINI_API_KEY")

# ... response code

stream = pya.open(
         format=FORMAT,
         channels=CHANNELS,
         rate=RECEIVE_SAMPLE_RATE,
         output=True)

def play_audio(chunks):
   chunk: Blob
   for chunk in chunks:
      stream.write(chunk.data)
