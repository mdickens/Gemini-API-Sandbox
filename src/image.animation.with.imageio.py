import imageio
import numpy as np
from PIL import Image

# Load images
img1 = Image.open("image1.png")
img2 = Image.open("image2.png")
img2 = Image.open("image3.png")

# Create a list to hold frames
frames = []

# Create transition frames
for alpha in np.linspace(0, 1, 30):
    blended = Image.blend(img1, img2, alpha)
    frames.append(np.array(blended))

# Save frames as a GIF
imageio.mimsave('output_animation.gif', frames, duration=0.1)

