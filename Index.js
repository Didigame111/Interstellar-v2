import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import express from "express";
import http from "node:http";

const app = express();
// Codespaces often defaults to 3000 or 8080.
const port = process.env.PORT || 8080; 

// A simple health-check route so you know the HTTP portion is working
app.get("/", (req, res) => {
  res.send("Wisp server is active and running!");
});

// Create the raw HTTP server
const server = http.createServer(app);

// Wisp intercepts websocket upgrade requests here
server.on("upgrade", (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

// Start listening
server.listen(port, () => {
  console.log(`Wisp Server listening on port ${port}`);
});
