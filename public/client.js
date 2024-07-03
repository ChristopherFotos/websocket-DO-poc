console.log("aloha");

const socket = io(`ws://${location.hostname}:8081`);

console.log(`ws://${location.hostname}:8081`);

const btn = document.getElementById("count-btn");
const count = document.getElementById("count");
btn.addEventListener("click", () => {
  socket.emit("up", {});
});

socket.on("connected", (info) => {
  console.log("UPDATE FROM SOCKET: ", info);
});

socket.on("update", (info) => {
  count.innerText = info;
});
