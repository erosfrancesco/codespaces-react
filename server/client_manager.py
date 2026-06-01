import json
import logging

import websockets

from config import config_store
from messages import (
    config_message,
    init_message,
    pong_message,
    state_message,
)

logger = logging.getLogger(__name__)


class ClientManager:
    def __init__(self, simulator):
        self.clients = set()
        self.simulator = simulator

    async def register(self, websocket):
        self.clients.add(websocket)

        await websocket.send(
            init_message(
                self.simulator.gpio_state(),
                self.simulator.sensor_readings(),
            )
        )

        await websocket.send(config_message())

    async def unregister(self, websocket):
        self.clients.discard(websocket)

    async def broadcast(self, message):
        disconnected = set()

        for client in self.clients:
            try:
                await client.send(message)
            except Exception:
                disconnected.add(client)

        for client in disconnected:
            self.clients.discard(client)

    async def broadcast_state(self):
        await self.broadcast(
            state_message(
                self.simulator.gpio_state(),
                self.simulator.sensor_readings(),
            )
        )

    async def handle_message(self, websocket, raw_message):
        data = json.loads(raw_message)

        match data.get("type"):
            case "ping":
                await websocket.send(pong_message())

            case "get_state":
                await websocket.send(
                    state_message(
                        self.simulator.gpio_state(),
                        self.simulator.sensor_readings(),
                    )
                )

            case "get_config":
                await websocket.send(config_message())

            case "set_config":
                updates = data.get("config", {})

                if not isinstance(updates, dict):
                    return

                config_store.set(updates)

                await self.broadcast(config_message())