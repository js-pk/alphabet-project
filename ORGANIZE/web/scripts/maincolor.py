
import cv2
import sklearn.cluster
import sklearn.metrics
import numpy as np
import datetime

def get_main_color(image_path):
  # Load the image
  image = cv2.imread(image_path)
  image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  
  # Resize it
  h, w, _ = image.shape
  w_new = int(100 * w / max(w, h) )
  h_new = int(100 * h / max(w, h) )
  
  image = cv2.resize(image, (w_new, h_new));
  
  # Reshape the image to be a list of pixels
  image_array = image.reshape((image.shape[0] * image.shape[1], 3))
  
  # Clusters the pixels
  clt = sklearn.cluster.KMeans(n_clusters = 3)
  clt.fit(image_array)
  
  
  def centroid_histogram(clt):
    # grab the number of different clusters and create a histogram
    # based on the number of pixels assigned to each cluster
    numLabels = np.arange(0, len(np.unique(clt.labels_)) + 1)
    (hist, _) = np.histogram(clt.labels_, bins = numLabels)
    
    # normalize the histogram, such that it sums to one
    hist = hist.astype("float")
    hist /= hist.sum()
    
    # return the histogram
    return hist
  
  
  # Finds how many pixels are in each cluster
  hist = centroid_histogram(clt)
  
  # Sort the clusters according to how many pixel they have
  zipped = zip(hist, clt.cluster_centers_)
  zipped = sorted(zipped, reverse=True, key=lambda x : x[0])
  hist = zip(*zipped)
  clt.cluster_centers = zip(*zipped)
  
  sklearn.metrics.silhouette_score(image_array, clt.labels_, metric='euclidean')
  
  best_silhouette = -1
  best_clusters = 0
  
  for clusters in range(2, 10):
    # Cluster colours
    clt = sklearn.cluster.KMeans(n_clusters = clusters)
    clt.fit(image_array)
  
    # Validate clustering result
    silhouette = sklearn.metrics.silhouette_score(image_array, clt.labels_, metric='euclidean')
    
    # Find the best one
    if silhouette > best_silhouette:
      best_silhouette = silhouette
      best_clusters = clusters
  
  best_clt = sklearn.cluster.KMeans(n_clusters = best_clusters)
  best_clt.fit(image_array)
  
  best_colors = []
  for rgb in best_clt.cluster_centers_:
    color_string = 'rgb(' + str(round(rgb[0])) + ', ' + str(round(rgb[1])) + ', ' + str(round(rgb[2])) + ')'
    best_colors.append(color_string)
  
  print(best_colors)
  
  height = 25
  sorted_image = np.zeros((height,len(best_clt.cluster_centers_),3), np.uint8) # (0,255)
  i = 0
  for rgb in best_clt.cluster_centers_:
    ## BGR 
    c = [round(rgb[2]), round(rgb[1]),round(rgb[0])]
    sorted_image[:,i] = c
    i += 1
  
  cv2.imwrite("main_" + datetime.datetime.now().strftime('%Y_%m_%d_%H:%M:%S') + ".png", sorted_image)
  
  return best_colors
  

