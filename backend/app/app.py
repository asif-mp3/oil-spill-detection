from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import websockets
import json
import asyncio

app = FastAPI()

# WebSocket connection to aisstream.io
async def fetch_ais_data(mmsi: str):
    uri = "wss://stream.aisstream.io/v0/stream"
    async with websockets.connect(uri) as ws:
        subscribe_message = {
            "APIKey": "836c9036603183429d928b5d7cf6f12d0ccc0627", 
            "BoundingBoxes": [
                [
                    [-90, -180],
                    [90, 180]
                ]
            ],
            "FiltersShipMMSI": [mmsi],
            "FilterMessageTypes":["PositionReport", "StandardClassBPositionReport"]
        }
        await ws.send(json.dumps(subscribe_message))
        
        try:
            async for message_json in ws:
                message = json.loads(message_json)
                if message.get("MessageType") == "PositionReport":
                    ais_message = message['Message']['PositionReport']
                    return {
                        "ShipId": ais_message["UserID"],
                        "Latitude": ais_message["Latitude"],
                        "Longitude": ais_message["Longitude"],
                        "SOG" : ais_message["Sog"],
                        "COG": ais_message["Cog"],
                        "Heading": ais_message["TrueHeading"]
                    }
                if message.get("MessageType") == "StandardClassBPositionReport":
                    ais_message = message['Message']['StandardClassBPositionReport']
                    return {
                        "ShipId": ais_message["UserID"],
                        "Latitude": ais_message["Latitude"],
                        "Longitude": ais_message["Longitude"],
                        "SOG" : ais_message["Sog"],
                        "COG": ais_message["Cog"],
                        "Heading": ais_message["TrueHeading"]
                    }
                # if message.get("MessageType") == "ShipStaticData":
                #     ais_message = message['Message']['ShipStaticData']
                #     return{
                #         "ImoNumber": ais_message["ImoNumber"],
                #         "CallSign": ais_message["CallSign"],
                #         "Type": ais_message["Type"],
                #         "Dimensions": ais_message["Dimensions"],
                #         "Name": ais_message["Name"]
                #     }

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
            result = await fetch_ais_data(mmsi)
            if result:
                await websocket.send_json(result)
            else:
                await websocket.send_text("No data received")
    except WebSocketDisconnect:
        print("Client disconnected")
