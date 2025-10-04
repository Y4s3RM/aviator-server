// server.js
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 10000;

// HTTP route (optional)
app.get("/", (req, res) => {
  res.send("🟢 Aviator Test Server is Running!");
});

// WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected ✅");
  ws.send(JSON.stringify({ message: "Connected to test server" }));

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    // Just echo back for testing
    ws.send(JSON.stringify({ message: "Echo: " + msg.toString() }));
  });
});

// Upgrade HTTP → WebSocket
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
