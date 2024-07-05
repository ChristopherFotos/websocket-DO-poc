const express = require("express");
const path = require("path");
const { createServer } = require("http");

const WebSocket = require("ws");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

// let number = 0;

// wss.on("connection", function (ws) {
//   console.log("connected");

//   ws.on("message", (event) => {
//     const stringEvent = event.toString();

//     const data = JSON.parse(stringEvent);

//     if (data.type === "up") {
//       number++;
//       console.log("number", number);
//     }

//     ws.send(JSON.stringify({ type: "update", number }));
//   });
// });

wss.on("connection", (ws) => {
  console.log("Someone has connected");
  ws.on("message", (event) => {
    const stringEvent = event.toString();
    const data = JSON.parse(stringEvent);

    console.log("MESSAGE RECIEVED: ", data);

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
