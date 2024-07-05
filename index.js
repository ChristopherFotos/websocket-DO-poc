const express = require("express");
const path = require("path");
const { createServer } = require("http");

const WebSocket = require("ws");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

let number = 0;

wss.on("connection", function (ws) {
  console.log("connected");

  ws.on("message", (event) => {
    console.log("stopping client interval");
    if (event.type === "up") {
      number++;
    }

    ws.send(number);
  });
});

server.listen(8080, function () {
  console.log("Listening on http://0.0.0.0:8080");
});
