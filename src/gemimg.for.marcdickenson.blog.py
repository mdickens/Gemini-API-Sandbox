from google import genai
from google.genai import types
import sys
import my_gemini
from PIL import Image


client = my_gemini.getClient()

image = Image.open(sys.argv[1])
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[image, f"Tell me about this image in scientific detail, in 200 words or less and output response in html format ready to post in my blog. Do not prefix the html output wiwith any other headers or captions that are not html. Only html output is allowed. Do not start the response with ```html or end the response with ```. {sys.argv[2]}"]
)
print(response.text)
