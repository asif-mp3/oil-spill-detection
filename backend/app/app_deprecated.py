from fastapi import FastAPI, WebSocket, WebSocketDisconnect, CORSMiddleware
import json
import asyncio
import websockets

app = FastAPI()

AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream"
API_KEY = "836c9036603183429d928b5d7cf6f12d0ccc0627" 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Specify the allowed HTTP methods
    allow_headers=["*"],  # Specify the allowed headers
)


# Endpoint to handle WebSocket connections from the frontend
@app.websocket("/ws/ship")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        # Wait for the frontend to send the MMSI number
        data = await websocket.receive_text()
        mmsi_number = json.loads(data)["mmsi"]

        # Connect to AISStream WebSocket
        async with websockets.connect(AISSTREAM_URL) as ais_ws:
            subscription_message = {
                "Apikey": API_KEY,
                "BoundingBoxes": [[-90, -180], [90, 180]],  # Worldwide tracking
                "FiltersShipMMSI": [mmsi_number],
                "FilterMessageTypes": ["PositionReport"]
            }
            await ais_ws.send(json.dumps(subscription_message))

            # Handle incoming messages from AISStream
            async for message in ais_ws:
                # Send ship info back to the frontend
                await websocket.send_text(json.dumps(message))

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()
