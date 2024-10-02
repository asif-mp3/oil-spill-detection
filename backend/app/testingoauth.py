from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
import os

# Your client credentials

cwd = os.getcwd()
with open(cwd + "\\oauthcreds.txt", "r+") as f:
    clientcreds = f.readlines()

client_id = 'sh-d3d19ea6-09f0-4f4e-8d69-d0d66de7b04c'
client_secret = 'qyX4eNzBU1okIQa6X4yGFK0ssfvHK3oi' 

# Create a session
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)

# Get token for the session
token = oauth.fetch_token(token_url='https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
                          client_secret=client_secret, include_client_id=True)

# All requests using this session will have an access token automatically added
resp = oauth.get("https://sh.dataspace.copernicus.eu/configuration/v1/wms/instances")
print(resp.content)