from google import genai
from google.genai import types
import sys
import my_gemini
from PIL import Image


client = my_gemini.getClient()

image = Image.open("./IMG_123X.jpg")
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[image, "Tell me about this image in detail"]
)
print(response.text)
