import sys
import os
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

def main():
    # Check if the image file is provided
    if len(sys.argv) < 2:
        print("Usage: python script.py <input_image>")
        sys.exit(1)

    # Get the input image from command line argument
    input_image_path = sys.argv[1]

    # Get the text input from the environment variable
    text_input = os.getenv('GEMINI_PROMPT')

    if text_input is None:
        print("Error: The environment variable GEMINI_PROMPT is not set.")
        sys.exit(1)

    # Open the image
    image = Image.open(input_image_path)

    # Initialize the GenAI client
    client = genai.Client()

    # Prepare the text input as a tuple
    text_input_tuple = (text_input,)

    # Generate content using the GenAI model
    response = client.models.generate_content(
        model="gemini-2.0-flash-preview-image-generation",
        contents=[text_input_tuple, image],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE']
        )
    )

    # Process the response
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            generated_image = Image.open(BytesIO(part.inline_data.data))
            generated_image.save('gemini-generated-image.png')
            generated_image.show()

if __name__ == "__main__":
    main()

