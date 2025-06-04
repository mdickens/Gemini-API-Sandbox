from google import genai
from google.genai import types
import sys
import my_gemini

client = my_gemini.getClient()

response = client.models.generate_content_stream(
    model="gemini-2.0-flash",
    contents=["Explain how AI works"]
)
for chunk in response:
    print(chunk.text, end="")
