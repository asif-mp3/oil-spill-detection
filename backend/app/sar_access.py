import requests
from datetime import date
from sentinelsat import read_geojson
import urllib.parse
import json

# Replace with your new API access token
api_token = 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhZmFlZTU2Zi1iNWZiLTRiMzMtODRlYS0zMWY2NzMyMzNhNzgifQ.eyJleHAiOjE3MjU5OTc4NjQsImlhdCI6MTcyNTk5NDI2NCwianRpIjoiNWNlMzkwYWUtODI3MS00NGUwLTg4NWEtN2JhOGU1MTVjNGZhIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5kYXRhc3BhY2UuY29wZXJuaWN1cy5ldS9hdXRoL3JlYWxtcy9DRFNFIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS5kYXRhc3BhY2UuY29wZXJuaWN1cy5ldS9hdXRoL3JlYWxtcy9DRFNFIiwic3ViIjoiYTEwMzBlMTAtYjAzYi00NDc5LTliMzAtODFlYjY2MDdkMGEzIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImNkc2UtcHVibGljIiwic2Vzc2lvbl9zdGF0ZSI6IjU1ZWMyN2Y5LTE4OWItNGE3ZS1iNzZhLTAwOTM4OTc5OGIxNiIsInNjb3BlIjoiQVVESUVOQ0VfUFVCTElDIG9wZW5pZCBlbWFpbCBwcm9maWxlIG9uZGVtYW5kX3Byb2Nlc3NpbmcgdXNlci1jb250ZXh0Iiwic2lkIjoiNTVlYzI3ZjktMTg5Yi00YTdlLWI3NmEtMDA5Mzg5Nzk4YjE2In0.x_CZ0vNPaU7i9hM4h9cjwDU8n1UZRj0vcCtMmAOluFw'

# Define the base API URL
base_api_url = "https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0/"

# Define the headers for token-based authentication
headers = {
    'Authorization': f'Bearer {api_token}',
    'Content-Type': 'application/json'
}

# Read GeoJSON data
geojson = read_geojson('sample_geojson_data.json')

# Convert GeoJSON object to JSON string using json.dumps
geojson_str = json.dumps(geojson)

# URL-encode the GeoJSON string
encoded_geojson = urllib.parse.quote(geojson_str)

# Print the encoded GeoJSON for debugging
print("Encoded GeoJSON:", encoded_geojson)

# Define the datetime range for the query
datetime_range = f"2024-01-01T00:00:00Z/{date.today().strftime('%Y-%m-%dT23:59:59Z')}"

# Specify the collections you're interested in
collections = 'sentinel-1-grd'

# Construct the query parameters
query_params = {
    'datetime': datetime_range,
    'collections': collections,
    'intersects': encoded_geojson,  # Use the URL-encoded GeoJSON string
    'format': 'json',
    'rows': 1,  # Adjust the number of results to get
    'start': 0
}

# Use the 'search' link from the JSON response
search_url = 'https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0/search'

# Send the request to the search endpoint
response = requests.get(search_url, headers=headers, params=query_params)

#print(f"Response Status Code: {response.status_code}")
#print(f"Response Content: {response.text}")

# Check if the request was successful
if response.status_code == 200:
    try:
        products = response.json()
        
        # Print the response JSON to understand its structure
        print("Response JSON:", products)
        
        # Verify JSON structure
        if 'features' in products:
            for feature in products['features']:
                download_url = feature.get('properties', {}).get('url')
                print("first-for-exec")
                if download_url:
                    print(f"Downloading product from URL: {download_url}")
                    # Download the product
                    download_response = requests.get(download_url, headers=headers, stream=True)
                    if download_response.status_code == 200:
                        with open('downloaded_image.zip', 'wb') as file:
                            for chunk in download_response.iter_content(chunk_size=8192):
                                file.write(chunk)
                        print("Download complete.")
                    else:
                        print(f"Error downloading product: {download_response.status_code}")
                #else: print("???")
        else:
            print("No 'features' key found in the response.")
    except ValueError as e:
        print(f"Error decoding JSON: {e}")
else:
    print(f"Error {response.status_code}: {response.text}")
