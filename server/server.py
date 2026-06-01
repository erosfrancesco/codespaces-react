import asyncio
import logging

import websockets

from config import config_store

logger = logging.getLogger(__name__)


class MockServer:
    def __init__(self, client_manager):
        self.client_manager = client_manager

    async def broadcast_loop(self):
        while True:
            if self.client_manager.clients:
                await self.client_manager.broadcast_state()

            await asyncio.sleep(
                config_store.get().get("update_interval", 1.0)
            )

    async def handle_client(self, websocket):
        await self.client_manager.register(websocket)

        try:
            async for message in websocket:
                await self.client_manager.handle_message(
                    websocket,
                    message,
                )

        finally:
            await self.client_manager.unregister(websocket)

    async def run(self, host, port):
        async with websockets.serve(
            self.handle_client,
            host,
            port,
        ):
            logger.info(
                "Mock server listening on ws://%s:%d",
                host,
                port,
            )

            await self.broadcast_loop()