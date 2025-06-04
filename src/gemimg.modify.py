from google import genai
from google.genai import types
import sys
import my_gemini
import PIL.Image
from PIL import Image
from io import BytesIO
import base64


client = my_gemini.getClient()

image = PIL.Image.open('./IMG_123X.jpg')


text_input = ('Hi, This is a picture of some helicopters.'
            'Can you add a realistic GenX vibe flying pig with wings next to each helicopter about to eat it?',)

response = client.models.generate_content(
    model="gemini-2.0-flash-preview-image-generation",
    contents=[text_input, image],
    config=types.GenerateContentConfig(
      response_modalities=['TEXT', 'IMAGE']
    )
)

for part in response.candidates[0].content.parts:
  if part.text is not None:
    print(part.text)
  elif part.inline_data is not None:
    image = Image.open(BytesIO(part.inline_data.data))
    image.show()
