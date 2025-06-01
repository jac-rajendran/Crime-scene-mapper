const canvas = document.getElementById("sceneCanvas");
const ctx = canvas.getContext("2d");

let elements = [];
let currentTool = "rectangle";
let drawing = false;
let currentPath = [];

function selectTool(tool) {
  currentTool = tool;
}

canvas.addEventListener("mousedown", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  if (currentTool === "draw") {
    drawing = true;
    currentPath = [{ x, y }];
  } else if (currentTool === "note") {
    const text = prompt("Enter your note:");
    if (text) {
      elements.push({ type: "note", x, y, text });
      render();
    }
  } else {
    elements.push({ type: currentTool, x, y });
    render();
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  currentPath.push({ x, y });
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  for (let i = 1; i < currentPath.length; i++) {
    ctx.moveTo(currentPath[i - 1].x, currentPath[i - 1].y);
    ctx.lineTo(currentPath[i].x, currentPath[i].y);
  }
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  if (drawing) {
    elements.push({ type: "draw", path: currentPath });
    drawing = false;
    currentPath = [];
  }
});

function clearCanvas() {
  elements = [];
  render();
}

function deleteLast() {
  elements.pop();
  render();
}

function drawIcon(x, y, type) {
  const img = new Image();
  img.src = `assets/${type}.png`;
  img.onload = function () {
    ctx.drawImage(img, x, y, 50, 50);
  };
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const obj of elements) {
    switch (obj.type) {
      case "rectangle":
        ctx.strokeStyle = "#0ff";
        ctx.strokeRect(obj.x, obj.y, 80, 60);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 30, 0, Math.PI * 2);
        ctx.strokeStyle = "#ff0";
        ctx.stroke();
        break;
      case "chair":
      case "sofa":
      case "door":
        drawIcon(obj.x, obj.y, obj.type);
        break;
      case "note":
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(obj.text, obj.x, obj.y);
        break;
      case "draw":
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        for (let i = 1; i < obj.path.length; i++) {
          ctx.moveTo(obj.path[i - 1].x, obj.path[i - 1].y);
          ctx.lineTo(obj.path[i].x, obj.path[i].y);
        }
        ctx.stroke();
        break;
    }
  }
}
