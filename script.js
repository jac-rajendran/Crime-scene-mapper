const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
let objects = [];
let currentTool = null;
let isDrawing = false;
let drawColor = "#000";
let startX, startY;

function selectTool(tool) {
  currentTool = tool;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects = [];
}

function drawIcon(x, y, type) {
  const img = new Image();
  img.src = `assets/${type}.png`;
  img.onload = () => {
    ctx.drawImage(img, x - 25, y - 25, 50, 50);
  };
}

canvas.addEventListener("mousedown", (e) => {
  startX = e.offsetX;
  startY = e.offsetY;

  if (currentTool === "draw") {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing && currentTool === "draw") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", (e) => {
  const endX = e.offsetX;
  const endY = e.offsetY;

  if (currentTool === "rectangle") {
    ctx.fillStyle = "red";
    ctx.fillRect(startX, startY, endX - startX, endY - startY);
  } else if (currentTool === "circle") {
    ctx.beginPath();
    ctx.arc(startX, startY, Math.abs(endX - startX), 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  } else if (["chair", "sofa", "door"].includes(currentTool)) {
    drawIcon(endX, endY, currentTool);
  }

  if (currentTool === "draw") {
    isDrawing = false;
    ctx.closePath();
  }
});

function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleString();
}

setInterval(updateDateTime, 1000);
