const express = require("express");
const cors = require("cors");
resolve = require("path").resolve;

const app = express();
app.use(cors());
app.use(express.static(resolve("../client")));

app.get("/home", (req, res) => {
  res.send("hello index");
});

app.listen(8080, () => console.log("Server started on port " + "8080"));

const http = require("http");

const socketServer = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (["GET", "POST"].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
    res.end("Hello World");
    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});

const io = require("socket.io")(socketServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Someone has connected");
  socket.on("draw", (info) => {
    console.log(info);

    io.emit("update", info);
  });
});

socketServer.listen(8081, () => console.log("socket listening on 8081"));
