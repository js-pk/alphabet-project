import cv2
from scipy.spatial import distance
import hilbert2
import numpy as np
import datetime
import random

def NN(A, start):
  #Nearest neighbor algorithm.
  #A is an NxN array indicating distance between N locations
  #start is the index of the starting location
  #Returns the path and cost of the found solution
  
  path = [start]
  cost = 0
  N = A.shape[0]
  mask = np.ones(N, dtype=bool)  # boolean values indicating which 
                                 # locations have not been visited
  mask[start] = False

  for i in range(N-1):
    last = path[-1]
    next_ind = np.argmin(A[last][mask]) # find minimum of remaining locations
    next_loc = np.arange(N)[mask][next_ind] # convert to original location
    path.append(next_loc)
    mask[next_loc] = False
    cost += A[last, next_loc]

  return [path, cost]
  
image_path = "../images/test5.png"
# image_path = "../images/test2.jpg"

# Load the image
image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB, cv2.CV_16U)

# Resize it
h, w, _ = image.shape
w_new = int(100 * w / max(w, h) )
h_new = int(100 * h / max(w, h) )

if w_new > 20:
  w_new = 20

if h_new > 20:
  h_new = 20

image = cv2.resize(image, (w_new, h_new));

# Reshape the image to be a list of pixels
colors = image.reshape((image.shape[0] * image.shape[1], 3))
# colors.sort()
# colors.sort(key=lambda rgb: colorsys.rgb_to_hsv(*rgb))

# colors = []
# for i in range(1, 1000):
#     colors.append (
#         [
#             random.random(),
#             random.random(),
#             random.random()
#         ]
#     )
    
#colors = sorted(colors, key=lambda r_g_b: hilbert2.Hilbert_to_int([int(r_g_b[0]*255),int(r_g_b[1]*255),int(r_g_b[2]*255)]))

# Distance matrix
A = np.zeros([len(colors),len(colors)])
for x in range(0, len(colors)-1):
  for y in range(0, len(colors)-1):
    A[x,y] = distance.euclidean(colors[x],colors[y])
# Nearest neighbour algorithm

path_and_cost = NN(A, 0)
# Final array
colors_nn = []
for i in path_and_cost[0]:
  colors_nn.append(colors[i])
    

height = 25
sorted_image = np.zeros((height,len(colors),3), np.uint8) # (0,255)

# for x in range(0, len(colors)-1):
#   c = [colors[x][0] * 255, colors[x][1] * 255, colors[x][2] * 255]
#   sorted_image[:,x] = c
  
for x in range(0, len(colors_nn)-1):
  c = [colors_nn[x][0] * 255, colors_nn[x][1] * 255, colors_nn[x][2] * 255]
  sorted_image[:,x] = c

cv2.imwrite("sort_" + datetime.datetime.now().strftime('%Y_%m_%d_%H:%M:%S') + ".png", sorted_image)



