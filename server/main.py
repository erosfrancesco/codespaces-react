import argparse
import asyncio

from config import config_store
from client_manager import ClientManager
from sensors import SensorSimulator
from server import MockServer


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--host",
        default=config_store.get()["ws_host"],
    )

    parser.add_argument(
        "--port",
        type=int,
        default=config_store.get()["ws_port"],
    )

    return parser.parse_args()


def main():
    args = parse_args()

    simulator = SensorSimulator()
    clients = ClientManager(simulator)
    server = MockServer(clients)

    asyncio.run(server.run(args.host, args.port))


if __name__ == "__main__":
    main()