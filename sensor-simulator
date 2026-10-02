import json
import random
import time
from datetime import datetime

import paho.mqtt.client as mqtt


MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "building/room001/sensor"


def generate_sensor_reading(sensor_id, room_id):
    """Generate one simulated environmental sensor reading."""
    return {
        "sensor_id": sensor_id,
        "room_id": room_id,
        "temperature": round(random.uniform(18, 30), 2),
        "humidity": round(random.uniform(40, 70), 2),
        "occupancy": random.randint(0, 20),
        "air_quality": random.randint(50, 150),
        "timestamp": datetime.now().isoformat()
    }


def main():
    sensor_id = "sensor_001"
    room_id = "room_001"

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    print("Connecting to MQTT broker...")
    client.connect(MQTT_BROKER, MQTT_PORT, 60)

    print("Connected to MQTT broker.")
    print(f"Publishing to: {MQTT_TOPIC}")

    while True:
        reading = generate_sensor_reading(sensor_id, room_id)

        payload = json.dumps(reading)

        client.publish(MQTT_TOPIC, payload)

        print(payload)

        time.sleep(5)


if __name__ == "__main__":
    main()
