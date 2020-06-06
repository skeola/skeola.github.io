# Quick script to rename the images for my site for easier hosting
import os

list = os.listdir("photos")

count = 1
for filename in list:
  renamed = "img-" + str(count) + ".jpg"
  os.rename("photos/"+filename, "photos/"+renamed)
  count += 1
