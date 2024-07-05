console.log("aloha");

const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
const ws = new WebSocket(`${protocol}://${location.host}`);

const btn = document.getElementById("count-btn");
const count = document.getElementById("count");
btn.addEventListener("click", () => {
  ws.send("up");
});

ws.onmessage((event) => {
  console.log(event.data);
  if (event.type === "update") count.innerText = event.data;
});

/////////////

// (function () {
//   const rss = document.getElementById("rss");
//   const heapTotal = document.getElementById("heapTotal");
//   const heapUsed = document.getElementById("heapUsed");
//   const external = document.getElementById("external");

//   // will not use tls if the connection is not made over https
//   const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
//   const ws = new WebSocket(`${protocol}://${location.host}`);

//   ws.onmessage = function (event) {
//     const data = JSON.parse(event.data);

//     rss.textContent = data.rss;
//     heapTotal.textContent = data.heapTotal;
//     heapUsed.textContent = data.heapUsed;
//     external.textContent = data.external;
//   };
// })();
