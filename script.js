const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');
let objects = [];
let drawing = false;
let currentTool = null;
let startX, startY;
let drawMode = false;
let color = "#ffffff";

// Set up color picker
document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
  ctx.strokeStyle = color;
});

canvas.addEventListener('mousedown', (e) => {
  const { x, y } = getMousePos(e);
  if (drawMode) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    startX = x;
    startY = y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (drawMode && drawing) {
    const { x, y } = getMousePos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', (e) => {
  const { x, y } = getMousePos(e);
  if (drawMode) {
    drawing = false;
  } else {
    if (!currentTool) return;
    if (["rectangle", "circle", "chair", "sofa", "door"].includes(currentTool)) {
      objects.push({ type: currentTool, x: startX, y: startY, x2: x, y2: y });
      render();
    }
  }
});

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function selectTool(tool) {
  currentTool = tool;
}

function toggleDrawing() {
  drawMode = !drawMode;
  if (drawMode) {
    canvas.style.cursor = 'crosshair';
  } else {
    canvas.style.cursor = 'default';
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects = [];
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
  for (const obj of objects) {
    switch (obj.type) {
      case 'rectangle':
        ctx.strokeStyle = color;
        ctx.strokeRect(obj.x, obj.y, obj.x2 - obj.x, obj.y2 - obj.y);
        break;
      case 'circle':
        ctx.strokeStyle = color;
        const radius = Math.hypot(obj.x2 - obj.x, obj.y2 - obj.y);
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'chair':
      case 'sofa':
      case 'door':
        drawIcon(obj.x, obj.y, obj.type);
        break;
    }
  }
}

// Timestamp clock
function updateTime() {
  const timestamp = document.getElementById("timestamp");
  const now = new Date();
  timestamp.textContent = now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();
