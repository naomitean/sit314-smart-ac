const express = require("express");
const mqtt = require("mqtt");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3003;

app.use(express.json());

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://localhost:1883";
const MQTT_TOPIC = "building/room001/processed";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "smart_ac";
const COLLECTION_NAME = "processed_events";

const mongoClient = new MongoClient(MONGODB_URI);

let collection;

async function connectToMongoDB() {
    try {
        await mongoClient.connect();

        const db = mongoClient.db(DB_NAME);
        collection = db.collection(COLLECTION_NAME);

        console.log("Connected to MongoDB");
        console.log(`Database: ${DB_NAME}`);
        console.log(`Collection: ${COLLECTION_NAME}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
            console.error("MQTT subscription error:", err);
        } else {
            console.log(`Subscribed to ${MQTT_TOPIC}`);
        }
    });
});

mqttClient.on("message", async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());

        console.log("Received processed event:");
        console.log(data);

        if (collection) {
            await collection.insertOne(data);
            console.log("Processed event stored in MongoDB");
        }
    } catch (error) {
        console.error("Storage error:", error.message);
    }
});

app.get("/health", (req, res) => {
    res.json({
        service: "storage-service",
        status: "healthy"
    });
});

async function start() {
    await connectToMongoDB();

    app.listen(PORT, () => {
        console.log(`Storage service running on port ${PORT}`);
    });
}

start();
