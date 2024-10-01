from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.responses import JSONResponse
import websockets
import json
from anomalydetection import anomalyDetection
import asyncio
from modelLoader import *
from fastapi.staticfiles import StaticFiles
import time
import os

app = FastAPI()
cwd = os.getcwd()


#make a static directory (to store result images) if we haven't already
if not os.path.exists(cwd + "\\static"):
    os.makedirs(cwd + "\\static")
app.mount("/static", StaticFiles(directory=cwd + "\\static"), name="static")


# API Key outsourcing (to avoid key leaks)
with open(cwd + "\\API_key.txt", "r+") as f:
    APIKEY = f.readline()

print(APIKEY)



yesorno = "no"
aresult = {}
global result


# WebSocket connection to aisstream.io
async def fetch_ais_data(mmsi: str):
    uri = "wss://stream.aisstream.io/v0/stream"
    async with websockets.connect(uri) as ws:
        start = time.time()
        subscribe_message = {
            "APIKey": APIKEY,
            "BoundingBoxes": [
                [
                    [-180, -180],
                    [180, 180]
                ]
            ],
            "FiltersShipMMSI": [mmsi],
            "FilterMessageTypes":["PositionReport", "StandardClassBPositionReport"]
        }
        await ws.send(json.dumps(subscribe_message))

        
        
        try:
            async for message_json in ws:
                message = json.loads(message_json)
                print("got the result")
                if message.get("MessageType") == "PositionReport":
                    ais_message = message['Message']['PositionReport']
                    result = {
                        # "ShipId": ais_message["UserID"],
                        "ShipId": mmsi,
                        "Latitude": ais_message["Latitude"],
                        "Longitude": ais_message["Longitude"],
                        "SOG" : ais_message["Sog"],
                        "COG": ais_message["Cog"],
                        "Heading": ais_message["TrueHeading"]
                    }

                    aresult = {
                        "Latitude": [ais_message["Latitude"]],
                        "Longitude": [ais_message["Longitude"]],
                        "SOG" : [ais_message["Sog"]],
                        "COG": [ais_message["Cog"]]
                    }

                if message.get("MessageType") == "StandardClassBPositionReport":
                    ais_message = message['Message']['StandardClassBPositionReport']
                    result = {
                        "ShipId": ais_message["UserID"],
                        "Latitude": ais_message["Latitude"],
                        "Longitude": ais_message["Longitude"],
                        "SOG" : ais_message["Sog"],
                        "COG": ais_message["Cog"],
                        "Heading": ais_message["TrueHeading"]
                    }

                    
                    aresult = {
                        "Latitude": [ais_message["Latitude"]],
                        "Longitude": [ais_message["Longitude"]],
                        "SOG" : [ais_message["Sog"]],
                        "COG": [ais_message["Cog"]]
                    }
                    print(result, aresult)

                #uncomment this if you want sample anomalous data
                # result = {
                #     "ShipId": 319200700,
                #     "Latitude": 61.05,
                #     "Longitude": 1,
                #     "SOG" : 0.3,
                #     "COG": 358.5,
                #     "Heading": 218 
                # }                


                # aresult = {
                #     'Latitude': [34.052235, 34.052236, 34.052237, 34.052238, 34.052239, 34.052240],
                #     'Longitude': [-118.243683, -118.243684, -118.243685, -118.243686, -118.243687, -118.243688],
                #     'SOG': [10, 11, 10.5, 10, 12, 15],
                #     'COG': [0, 5, 2, 1, 7, 50]
                # }


                is_anomaly = anomalyDetection(aresult)
                print("IS THERE AN ANOMLY??", is_anomaly)
                yesorno = "yes" if is_anomaly else "no"
                loadModel(yesorno)
                result["yesorno"] = yesorno
                return result

                    

#TO ADDql
# Status: Current status of the vessel (e.g., anchored, underway, etc.)
# Cargo: 
        except websockets.ConnectionClosed:
            print("WebSocket connection closed")




@app.websocket("/ws/ship")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            mmsi = data.get("mmsi")
            if not mmsi:
                await websocket.send_text("MMSI value is missing")
                continue
            
            # Fetch AIS data
            resultGiven = await fetch_ais_data(mmsi)
            if resultGiven:
                await websocket.send_json(resultGiven)
            else:
                await websocket.send_text("No data received")
    except WebSocketDisconnect:
        print("Client disconnected")
