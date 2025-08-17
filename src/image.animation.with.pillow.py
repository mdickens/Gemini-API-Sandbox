from moviepy.editor import *

# Load images
image1 = ImageClip("image1.png").set_duration(1)  # Set duration for each image
image2 = ImageClip("image2.png").set_duration(1)
image3 = ImageClip("image3.png").set_duration(1)

# Create a list of images
clips = [image1, image2, image3]

# Create transitions
transition_clips = []
for i in range(len(clips) - 1):
    transition = clips[i].crossfadein(0.5).crossfadeout(0.5)
    transition_clips.append(transition)

# Concatenate clips with transitions
final_gif = concatenate_videoclips(transition_clips + [clips[-1]])

# Write the result to a GIF file
final_gif.write_gif("output_animation.gif", fps=10)

