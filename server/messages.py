import json
from datetime import datetime

from config import config_store


def timestamp():
    return datetime.utcnow().isoformat()


def config_message():
    return json.dumps({
        "type": "config",
        "timestamp": timestamp(),
        "config": config_store.get(),
    })


def init_message(gpio, sensors):
    return json.dumps({
        "type": "init",
        "timestamp": timestamp(),
        "gpio": gpio,
        "pins": config_store.get()["gpio_pins"],
        "sensors": sensors,
        "serial": None,
    })


def state_message(gpio, sensors):
    return json.dumps({
        "type": "state",
        "timestamp": timestamp(),
        "gpio": gpio,
        "sensors": sensors,
        "serial": "MOCK: hello from mock_server",
    })


def pong_message():
    return json.dumps({
        "type": "pong",
        "timestamp": timestamp(),
    })