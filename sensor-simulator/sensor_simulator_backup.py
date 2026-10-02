import random
import time
from datetime import datetime


def generate_sensor_reading(sensor_id, room_id):
    """Generate one simulated environmental sensor reading."""

    reading = {
        "sensor_id": sensor_id,
        "room_id": room_id,
        "temperature": round(random.uniform(18, 30), 2),
        "humidity": round(random.uniform(40, 70), 2),
        "occupancy": random.randint(0, 20),
        "air_quality": random.randint(50, 150),
        "timestamp": datetime.now().isoformat()
    }

    return reading


def main():
    sensor_id = "sensor_001"
    room_id = "room_001"

    while True:
        reading = generate_sensor_reading(sensor_id, room_id)

        print(reading)

        time.sleep(5)


if __name__ == "__main__":
    main()
