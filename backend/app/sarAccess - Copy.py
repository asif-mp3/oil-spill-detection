from sentinelhub import SHConfig
from sentinelhub import SentinelHubCatalog, SentinelHubRequest
from sentinelhub import DataCollection, BBox, CRS
from sentinelhub import SentinelHubRequest, DataCollection, MimeType, CRS, BBox, bbox_to_dimensions, SHConfig
import os



cwd = os.getcwd()
with open(cwd + "\\oauthcreds.txt", "r+") as f:
    clientcreds = f.readlines()


config = SHConfig()
config.sh_client_id = 'f5f5cbef-2129-4585-8843-74e925a439a8' 
config.sh_client_secret = 'OMxauLn4GqngJOa6uEcaqRxSJQuuUJyk'
# config.sh_base_url = 'https://sh.dataspace.copernicus.eu'
config.sh_base_url = 'https://services.sentinel-hub.com'
# config.sh_token_url = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'
config.sh_token_url = 'https://services.sentinel-hub.com/oauth/token'


catalog = SentinelHubCatalog(config = config)
# print(catalog.get_info())
# print(catalog.get_collection(DataCollection.SENTINEL2_L2A))

time_interval = "2024-08-01", "2024-10-01"

bbox = BBox((49.9604, 44.7176, 51.0481, 45.2324), crs=CRS.WGS84)
# bbox =[1360000,5121900,1370000,5131900]

# Reduce resolution to reduce output size
resolution = 100  # Increase resolution to reduce image size
bbox_size = bbox_to_dimensions(bbox, resolution=resolution)

# Cap the size to max 2500x2500 pixels
max_size = (min(bbox_size[0], 2500), min(bbox_size[1], 2500))

# search_iterator = catalog.search(
#     DataCollection.SENTINEL1_IW,
#     bbox=bbox,
#     time=time_interval,
#     fields={"include": ["id", "properties.datetime"], "exclude": []},
# )

# # results = list(search_iterator)
# print(list(search_iterator))
# print("Total number of results:", len(results))

# Evalscript to visualize VV polarization of the SAR data
evalscript_sar = """
//VERSION=3
function setup() {
  return {
    input: ["VV"],
    output: { bands: 1 }
  };
}

function evaluatePixel(sample) {
  return [sample.VV];
}
"""

# Create the request to download the SAR data
request = SentinelHubRequest(
    evalscript=evalscript_sar,
    input_data=[
        SentinelHubRequest.input_data(
            data_collection=DataCollection.SENTINEL1_EW,
            time_interval=time_interval
        )
    ],
    responses=[
        SentinelHubRequest.output_response('default', MimeType.TIFF)
    ],
    bbox=bbox,
    size=bbox_size,
    config=config
)

# Execute the request and save the image
image = request.get_data()[0]

# Save the image to file
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

# Convert to numpy array and save as image
image_array = np.asarray(image)
img = Image.fromarray((image_array * 255).astype(np.uint8))  # Scale the image to [0, 255]
img.save('sentinel1_sar_image.tif')
plt.imshow(image_array, cmap='gray')
plt.show()