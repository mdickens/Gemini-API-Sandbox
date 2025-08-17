import imageio
import numpy as np
from PIL import Image

# Load images
img1 = Image.open("image1.png")
img2 = Image.open("image2.png")
img3 = Image.open("image3.png")

# Create a list to hold frames
frames = []

# Create transition frames between img1 and img2
for alpha in np.linspace(0, 1, 30):
    blended = Image.blend(img1, img2, alpha)
    frames.append(np.array(blended))

# Create transition frames between img2 and img3
for alpha in np.linspace(0, 1, 30):
    blended = Image.blend(img2, img3, alpha)
    frames.append(np.array(blended))

# Create transition frames between img3 and img1 (to loop back)
for alpha in np.linspace(0, 1, 30):
    blended = Image.blend(img3, img1, alpha)
    frames.append(np.array(blended))

# Save frames as a GIF with looping
imageio.mimsave('output_animation.webp', frames, duration=0.1, loop=0)  # loop=0 means infinite loop

