import sys
from google import genai
import os

# Read the environment variable
gemini_api_key = os.getenv('GEMINI_API_KEY')

# You can then check if it was set and use it
if gemini_api_key is not None:
    print("GEMINI_API_KEY found.", file=sys.stderr)
    # Your code that uses the API key goes here
else:
    print("GEMINI_API_KEY environment variable not set.",file=sys.stderr)
    sys.exit(1)  # Exit with a non-zero error code (e.g., 1 for generic error)
    # Handle the case where the key is not found (e.g., raise an error, exit)

client = genai.Client(api_key=gemini_api_key)

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works in a under 1000 words in the style of Gen X"
)
print(response.text)
