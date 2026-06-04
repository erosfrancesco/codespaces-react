import json
from pathlib import Path
from threading import Lock

CONFIG_FILE = Path("runtime_config.json")

DEFAULT_CONFIG = {
    "ws_host": "0.0.0.0",
    "ws_port": 8765,
    "update_interval": 1.0,
    "device_name": "Mock Dashboard",
    "gpio_pins": [17, 18, 27, 22],
    "simulation": {
        "temperature_enabled": True,
        "humidity_enabled": True,
        "pressure_enabled": True
    }
}

_lock = Lock()


class ConfigStore:
    def __init__(self):
        self._config = DEFAULT_CONFIG.copy()
        self.load()

    def load(self):
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, "r") as f:
                self._config.update(json.load(f))
        else:
            self.save()

    def save(self):
        with _lock:
            with open(CONFIG_FILE, "w") as f:
                json.dump(self._config, f, indent=2)

    def get(self):
        return self._config

    def set(self, updates: dict):
        self._config.update(updates)
        self.save()


config_store = ConfigStore()