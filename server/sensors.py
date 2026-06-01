import math
import random
from datetime import datetime

from config import config_store


class SensorSimulator:
    def gpio_state(self) -> dict:
        return {
            str(pin): random.choice([True, False])
            for pin in config_store.get()["gpio_pins"]
        }

    def sensor_readings(self) -> dict:
        now = datetime.utcnow().timestamp()

        return {
            "temperature": {
                "label": "Temperature",
                "unit": "°C",
                "value": round(
                    22 + 4 * math.sin(now / 10) + random.uniform(-0.5, 0.5),
                    2,
                ),
            },
            "humidity": {
                "label": "Humidity",
                "unit": "%",
                "value": round(
                    55 + 10 * math.cos(now / 12) + random.uniform(-1.5, 1.5),
                    2,
                ),
            },
            "pressure": {
                "label": "Pressure",
                "unit": "hPa",
                "value": round(
                    1013 + 3 * math.sin(now / 18) + random.uniform(-0.3, 0.3),
                    2,
                ),
            },
        }