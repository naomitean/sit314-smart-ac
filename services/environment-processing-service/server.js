const express = require("express");
const mqtt = require("mqtt");

const app = express();
const PORT = 3002;

app.use(express.json());

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://localhost:1883";

const INPUT_TOPIC = "$share/environment-processors/building/room001/ac";
const OUTPUT_TOPIC = "building/room001/processed";

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe(INPUT_TOPIC, (err) => {
        if (err) {
            console.error("Subscription error:", err);
        } else {
            console.log(`Subscribed to ${INPUT_TOPIC}`);
        }
    });
});

client.on("message", (topic, message) => {
    try {
        const data = JSON.parse(message.toString());

        const processedData = {
            sensor_id: data.sensor_id,
            room_id: data.room_id,
            temperature: Number(data.temperature),
            humidity: Number(data.humidity),
            occupancy: Number(data.occupancy),
            air_quality: Number(data.air_quality),
            ac_mode: data.ac_mode,
            cooling_intensity: Number(data.cooling_intensity),
            timestamp: data.timestamp
        };

        console.log("Processed environment event:");
        console.log(processedData);

        client.publish(
            OUTPUT_TOPIC,
            JSON.stringify(processedData)
        );

        console.log(`Published to ${OUTPUT_TOPIC}`);
    } catch (error) {
        console.error("Processing error:", error.message);
    }
});

app.get("/health", (req, res) => {
    res.json({
        service: "environment-processing-service",
        status: "healthy"
    });
});

app.listen(PORT, () => {
    console.log(`Environment processing service running on port ${PORT}`);
});
