from google import genai
from google.genai import types
import sys
import my_gemini

client = my_gemini.getClient()

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["Explain how AI works"],
    config=types.GenerateContentConfig(
        max_output_tokens=500,
        temperature=sys.argv[1]
    )
)
print(response.text)
