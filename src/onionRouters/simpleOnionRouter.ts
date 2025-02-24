import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";

// Variables to store the last received messages and destination
let lastReceivedEncryptedMessage: string | null = null;
let lastReceivedDecryptedMessage: string | null = null;
let lastMessageDestination: number | null = null;

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // Status route
  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

  // Route to get the last received encrypted message
  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.json({ result: lastReceivedEncryptedMessage });
  });

  // Route to get the last received decrypted message
  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.json({ result: lastReceivedDecryptedMessage });
  });

  // Route to get the last message's destination
  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.json({ result: lastMessageDestination });
  });

  // Example route to simulate receiving a message (for testing purposes)
  onionRouter.post("/receiveMessage", (req, res) => {
    const { encryptedMessage, decryptedMessage, destination } = req.body;

    // Update the last received message and destination
    lastReceivedEncryptedMessage = encryptedMessage || null;
    lastReceivedDecryptedMessage = decryptedMessage || null;
    lastMessageDestination = destination || null;

    res.json({ message: "Message received and processed" });
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
        `Onion router ${nodeId} is listening on port ${
            BASE_ONION_ROUTER_PORT + nodeId
        }`
    );
  });

  return server;
}
