import imageio
import numpy as np
from PIL import Image

# Load images and resize to 300x300
images = [Image.open(f"image{i+1}.png").resize((300, 300)) for i in range(3)]  # Assuming images are named image1.png, image2.png, ..., image10.png

# Create a list to hold frames
frames = []

# Create transition frames between each pair of images
for i in range(len(images)):
    img1 = images[i]
    img2 = images[(i + 1) % len(images)]  # Loop back to the first image after the last one
    for alpha in np.linspace(0, 1, 30):
        blended = Image.blend(img1, img2, alpha)
        frames.append(np.array(blended))

# Save frames as a GIF with looping
imageio.mimsave('output_animation.gif', frames, duration=0.1, loop=0)  # loop=0 means infinite loop

