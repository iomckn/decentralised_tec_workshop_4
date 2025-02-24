import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

// Variables to store the last received and last sent messages
let lastReceivedMessage: string | null = null;
let lastSentMessage: string | null = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // Status route
  _user.get("/status", (req, res) => {
    res.send("live");
  });

  // Route to get the last received message
  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  // Route to get the last sent message
  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  // Example route to simulate receiving a message (for testing purposes)
  _user.post("/receiveMessage", (req, res) => {
    const { message } = req.body;
    lastReceivedMessage = message || null;
    res.json({ message: "Message received" });
  });

  // Example route to simulate sending a message (for testing purposes)
  _user.post("/sendMessage", (req, res) => {
    const { message } = req.body;
    lastSentMessage = message || null;
    res.json({ message: "Message sent" });
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
