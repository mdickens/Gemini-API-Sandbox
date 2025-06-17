from google import genai
from google.genai import types

client = genai.Client()

transcript = client.models.generate_content(
   model="gemini-2.0-flash",
   contents="""Generate a short transcript around 100 words that reads
            like it was clipped from a podcast by software development managers
            The hosts names are Marc and Kim.""").text

response = client.models.generate_content(
   model="gemini-2.5-flash-preview-tts",
   contents=transcript,
   config=types.GenerateContentConfig(
      response_modalities=["AUDIO"],
      speech_config=types.SpeechConfig(
         multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
               types.SpeakerVoiceConfig(
                  speaker='Marc',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Algenib',
                     )
                  )
               ),
               types.SpeakerVoiceConfig(
                  speaker='Kim',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Despina',
                     )
                  )
               ),
            ]
         )
      )
   )
)

# ...Code to stream



import pyaudio # You'll need to install PyAudio


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
