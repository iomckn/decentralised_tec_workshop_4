import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "../config";

// Store registered nodes in memory
const registeredNodes: { nodeId: number; port: number }[] = [];

export async function registry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  // Status route
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  // POST route to register a node
  _registry.post("/registerNode", (req, res) => {
    const { nodeId, port } = req.body;

    if (typeof nodeId !== "number" || typeof port !== "number") {
      return res.status(400).json({ error: "Invalid nodeId or port." });
    }

    // Check if the node is already registered
    const existingNode = registeredNodes.find((node) => node.nodeId === nodeId);
    if (existingNode) {
      return res.status(409).json({ error: "Node already registered." });
    }

    // Register the new node
    registeredNodes.push({ nodeId, port });
    console.log(`Node ${nodeId} registered on port ${port}`);
    res.json({ message: "Node registered successfully." });
  });

  // Optional: GET route to list all registered nodes
  _registry.get("/getRegisteredNodes", (req, res) => {
    res.json({ registeredNodes });
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`Registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
