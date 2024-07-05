// const express = require("express");
// const path = require("path");
// const { createServer } = require("http");

// const WebSocket = require("ws");

// const app = express();
// app.use(express.static(path.join(__dirname, "/public")));

// const server = createServer(app);
// const wss = new WebSocket.Server({ server });

// let number = 0;

// wss.on("connection", function (ws) {
//   console.log("connected");

//   ws.on("message", (event) => {
//     console.log("stopping client interval");
//     if (event.type === "up") {
//       number++;
//     }

//     ws.send({ type: "update", number });
//   });
// });

// server.listen(8080, function () {
//   console.log("Listening on http://0.0.0.0:8080");
// });

///////////////////
"use strict";

const express = require("express");
const path = require("path");
const { createServer } = require("http");

const WebSocket = require("ws");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function (ws) {
  const id = setInterval(function () {
    ws.send(JSON.stringify(process.memoryUsage()), function () {
      //
      // Ignore errors.
      //
    });
  }, 100);
  console.log("started client interval");

  ws.on("close", function () {
    console.log("stopping client interval");
    clearInterval(id);
  });
});

server.listen(8080, function () {
  console.log("Listening on http://0.0.0.0:8080");
});
