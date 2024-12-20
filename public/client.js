const socket = io();

console.log("IT DEPLOYED 22");

const grid = document.getElementById("grid");
const gridSize = {
  height: 40,
  width: 25,
};

const rows = [];

// Tracks whether the mouse is drawing
const mouseState = { drawing: false };

const startDrawEvents = ["mousedown", "touchstart"];
const stopDrawEvents = ["mouseup", "touchend"];

window.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const element = document.elementFromPoint(
    e.touches[0].clientX,
    e.touches[0].clientY
  );

  console.log("ELEMENT: ", element);
  if (!element) {
    console.log("UNDEFINED ELEMENT");
    return;
  }

  element.dataset.state > 0
    ? (element.dataset.state = 0)
    : (element.dataset.state = 1);

  socket.emit("touchdraw", {
    type: "touchdraw",
    co: element.dataset.coordinates,
    state: element.dataset.state,
  });
});

// Change mouseState.drawing to true when mouse goes down or touch is detected
startDrawEvents.forEach((startDrawEvent) =>
  document.addEventListener(startDrawEvent, () => {
    mouseState.drawing = true;
  })
);

// Change mouseState.drawing to false when mouse goes up or touch ends
stopDrawEvents.forEach((stopDrawEvent) =>
  document.addEventListener(stopDrawEvent, () => {
    mouseState.drawing = false;
    console.log(mouseState);
  })
);

// Making the grid
for (let i = 0; i < gridSize.height; i++) {
  const row = document.createElement("div");
  row.classList.add("row");
  const rowArray = [];

  // Inner loop to create cells
  for (let j = 0; j < gridSize.width; j++) {
    const cell = document.createElement("div");

    cell.dataset.coordinates = JSON.stringify({ x: j, y: i });
    cell.dataset.state = 0;
    cell.classList.add("cell");

    // Add event listeners for mousenter and click
    const drawEvents = ["mouseenter", "click"];
    drawEvents.forEach((de) => {
      cell.addEventListener(de, () => {
        console.log("FIRING EVENT:", de);
        // if the event is click, do this:
        if (de === "click") {
          cell.dataset.state > 0
            ? (cell.dataset.state = 0)
            : (cell.dataset.state = 1);
          // emit an event with info about the cell
          socket.emit("draw", {
            type: "draw",
            co: cell.dataset.coordinates,
            state: cell.dataset.state,
          });
        }
        // if the event is mouseenter and we're drawing, do this
        if (de === "mouseenter" && mouseState.drawing) {
          cell.dataset.state > 0
            ? (cell.dataset.state = 0)
            : (cell.dataset.state = 1);
          // emit an event with info about the cell
          socket.emit("draw", {
            type: "draw",
            co: cell.dataset.coordinates,
            state: cell.dataset.state,
          });
        }
      });
    });

    row.appendChild(cell);
    rowArray.push(cell);
  }

  // Now that the outer loop has finished, append the row element to the grid and push the rowArray into rows
  grid.appendChild(row);
  rows.push(rowArray);
}

socket.on("update", (info) => {
  console.log("UPDATE FROM SOCKET.IO: ", info);
  info.co = JSON.parse(info.co);

  rows[info.co.y][info.co.x].dataset.state = info.state;
});
