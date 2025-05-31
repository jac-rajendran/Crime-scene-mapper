// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 250;
canvas.height = window.innerHeight;

let shapes = [];
let currentShape = null;
let drawing = false;
let selectedShape = null;
let bgImage = null;

const shapeButtons = document.querySelectorAll('[data-shape]');
const deleteBtn = document.getElementById('deleteBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const colorPicker = document.getElementById('colorPicker');
const bgUpload = document.getElementById('bgUpload');

shapeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentShape = btn.dataset.shape;
  });
});

deleteBtn.addEventListener('click', () => {
  if (selectedShape !== null) {
    shapes.splice(selectedShape, 1);
    selectedShape = null;
    redraw();
  }
});

clearBtn.addEventListener('click', () => {
  shapes = [];
  bgImage = null;
  selectedShape = null;
  redraw();
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem('scene', JSON.stringify(shapes));
});

loadBtn.addEventListener('click', () => {
  const data = localStorage.getItem('scene');
  if (data) shapes = JSON.parse(data);
  redraw();
});

bgUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = () => {
      bgImage = img;
      redraw();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  drawing = true;

  if (currentShape) {
    const color = colorPicker.value;
    const shape = { type: currentShape, x, y, w: 60, h: 60, color };
    shapes.push(shape);
    redraw();
  } else {
    selectedShape = shapes.findIndex(s =>
      x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h
    );
  }
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
});

canvas.addEventListener('mousemove', e => {
  if (!drawing || selectedShape === null) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const shape = shapes[selectedShape];
  shape.x = x - shape.w / 2;
  shape.y = y - shape.h / 2;
  redraw();
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgImage) ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  shapes.forEach(s => {
    ctx.fillStyle = s.color || '#000';
    switch (s.type) {
      case 'rect':
        ctx.fillRect(s.x, s.y, s.w, s.h);
        break;
      case 'square':
        ctx.fillRect(s.x, s.y, 50, 50);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(s.x + 25, s.y + 25, 25, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'chair':
        ctx.font = '30px Segoe UI Emoji';
        ctx.fillText('🪑', s.x, s.y + 30);
        break;
      case 'sofa':
        ctx.font = '30px Segoe UI Emoji';
        ctx.fillText('🛋️', s.x, s.y + 30);
        break;
      case 'door':
        ctx.font = '30px Segoe UI Emoji';
        ctx.fillText('🚪', s.x, s.y + 30);
        break;
      case 'text':
        ctx.font = '20px sans-serif';
        ctx.fillText('TEXT', s.x, s.y);
        break;
    }
  });
}
