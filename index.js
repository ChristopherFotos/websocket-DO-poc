const express = require("express");
const cors = require("cors");
resolve = require("path").resolve;

const app = express();
app.use(cors());
app.use(express.static(resolve("../client")));

app.get("/home", (req, res) => {
  res.send("hello index");
});

app.listen(8080, () => console.log("Server started on port" + "8080"));
