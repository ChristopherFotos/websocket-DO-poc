const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const handleChangesToMain = require("./changes-to-main");

const WebSocket = require("ws");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));
app.post("/changes-to-main-branch", handleChangesToMain);

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Someone has connected");
  ws.on("message", (event) => {
    const stringEvent = event.toString();
    const data = JSON.parse(stringEvent);

    console.log("MESSAGE RECIEVED: ", data);

    // Send to all clients who are listening
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "update", info: data }));
      }
    });
  });
});

server.listen(8080, function () {
  console.log("Listening on http://0.0.0.0:8080");
});
