from sentinelhub import SHConfig
from sentinelhub import SentinelHubCatalog, SentinelHubRequest
from sentinelhub import DataCollection, BBox, CRS
from sentinelhub import SentinelHubRequest, DataCollection, MimeType, CRS, BBox, bbox_to_dimensions, SHConfig
from datetime import datetime, timedelta
import os





def getSARImage(bb):
    config = SHConfig()
    config.sh_client_id = 'f5f5cbef-2129-4585-8843-74e925a439a8' 
    config.sh_client_secret = 'OMxauLn4GqngJOa6uEcaqRxSJQuuUJyk'
    config.sh_base_url = 'https://services.sentinel-hub.com'
    config.sh_token_url = 'https://services.sentinel-hub.com/oauth/token'


    catalog = SentinelHubCatalog(config = config)

    today = datetime.now()
    formatted_today = today.strftime("%Y-%m-%d")

    # get a few days before (week in this case)
    days_before = today - timedelta(days=7)
    formatted_days_before = days_before.strftime("%Y-%m-%d")

    # Output the formatted dates
    time_interval = formatted_days_before, formatted_today

    # bbox = BBox((49.9604, 44.7176, 51.0408, 45.2324), crs=CRS.WGS84)
    # bbox = BBox((80.144676, 12.976422, 80.184615, 13.016838), crs = CRS.WGS84)
    bbox = BBox(bb, crs = CRS.WGS84)
    # bbox =[1360000,5121900,1370000,5131900]

    # Reduce resolution to reduce output size
    resolution = 12  # Increase resolution to reduce image size
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
                data_collection=DataCollection.SENTINEL1_IW,
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
    # img.save('sentinel1_sar_image.tif')
    img.save('static/sarImage.jpg');
    # plt.imshow(image_array, cmap='gray')
    # plt.show()
    return


'''
delta = 0.02
# result = (80.144676, 12.976422, 80.184615, 13.016838)
result  = (80.168889, 12.990302)
# result = (103.9080605, 1.262379)
coords = (result[0] - delta, result[1] - delta, result[0] + delta, result[1] + delta)
getSARImage(coords)

# k = delta * resolution
'''


