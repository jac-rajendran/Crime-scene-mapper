const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let shapes = [];
let currentTool = null;
let selectedShapeIndex = null;
let drawing = false;
let startX, startY;
let bgImage = null;

function selectTool(tool) {
  currentTool = tool;
  selectedShapeIndex = null;
}

function uploadBackground(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = () => {
        bgImage = img;
        redraw();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function clearCanvas() {
  shapes = [];
  selectedShapeIndex = null;
  redraw();
}

function saveDrawing() {
  localStorage.setItem('crimeSceneShapes', JSON.stringify(shapes));
}

function loadDrawing() {
  const saved = localStorage.getItem('crimeSceneShapes');
  if (saved) {
    shapes = JSON.parse(saved);
    redraw();
  }
}

function deleteSelected() {
  if (selectedShapeIndex !== null) {
    shapes.splice(selectedShapeIndex, 1);
    selectedShapeIndex = null;
    redraw();
  }
}

canvas.addEventListener('mousedown', (e) => {
  startX = e.offsetX;
  startY = e.offsetY;
  drawing = true;

  selectedShapeIndex = null;
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (startX >= shape.x && startX <= shape.x + shape.w &&
        startY >= shape.y && startY <= shape.y + shape.h) {
      selectedShapeIndex = i;
      redraw();
      return;
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!drawing || !currentTool) return;

  const x = Math.min(startX, e.offsetX);
  const y = Math.min(startY, e.offsetY);
  const w = Math.abs(startX - e.offsetX);
  const h = Math.abs(startY - e.offsetY);

  if (currentTool === 'square') {
    shapes.push({ type: 'rect', x, y, w: Math.max(w, h), h: Math.max(w, h), color: colorPicker.value });
  } else if (currentTool === 'rectangle') {
    shapes.push({ type: 'rect', x, y, w, h, color: colorPicker.value });
  } else if (currentTool === 'circle') {
    shapes.push({ type: 'circle', x, y, w, h, color: colorPicker.value });
  } else {
    const labelMap = {
      'chair': '🪑',
      'sofa': '🛋️',
      'door': '🚪',
      'text': 'Text'
    };
    shapes.push({ type: 'icon', label: labelMap[currentTool] || '?', x, y, w: 40, h: 40, color: colorPicker.value });
  }

  drawing = false;
  redraw();
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  shapes.forEach((shape, i) => {
    ctx.fillStyle = shape.color;
    if (shape.type === 'rect') {
      ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.ellipse(shape.x + shape.w / 2, shape.y + shape.h / 2, shape.w / 2, shape.h / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
    } else if (shape.type === 'icon') {
      ctx.font = "30px Arial";
      ctx.fillText(shape.label, shape.x, shape.y + 25);
    }

    if (i === selectedShapeIndex) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    }
  });
}
