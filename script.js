document.addEventListener('DOMContentLoaded', () => {
  // Initialize Fabric.js canvas
  const canvas = new fabric.Canvas('sceneCanvas', {
    selection: true,
    backgroundColor: '#333333',
    preserveObjectStacking: true
  });

  // Set canvas to fill available space
  function resizeCanvas() {
    const container = document.querySelector('.canvas-wrapper');
    canvas.setWidth(container.offsetWidth);
    canvas.setHeight(container.offsetHeight);
    canvas.renderAll();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Tool selection
  let currentTool = 'select';
  let currentColor = '#ff0000';
  let currentFill = '#ff000066';
  let currentSize = 3;
  let isDrawing = false;
  let startPoint = null;
  let currentText = null;
  let measureStart = null;
  let measureLine = null;

  // DOM elements
  const toolButtons = document.querySelectorAll('[data-tool]');
  const strokeColorInput = document.getElementById('strokeColor');
  const fillColorInput = document.getElementById('fillColor');
  const sizeInput = document.getElementById('sizeInput');
  const sizeValue = document.getElementById('sizeValue');
  const deleteBtn = document.getElementById('deleteSelected');
  const clearBtn = document.getElementById('clearAll');
  const undoBtn = document.getElementById('undoAction');
  const saveBtn = document.getElementById('saveScene');
  const loadBtn = document.getElementById('loadScene');
  const exportBtn = document.getElementById('exportScene');
  const bgUpload = document.getElementById('bgUpload');
  const measureTooltip = document.querySelector('.measure-tooltip');

  // Tool selection
  toolButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentTool = button.dataset.tool;
      toolButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Clear selection when switching tools
      canvas.discardActiveObject().renderAll();
    });
  });

  // Color and size controls
  strokeColorInput.addEventListener('input', (e) => {
    currentColor = e.target.value;
  });

  fillColorInput.addEventListener('input', (e) => {
    currentFill = e.target.value;
  });

  sizeInput.addEventListener('input', (e) => {
    currentSize = parseInt(e.target.value);
    sizeValue.textContent = currentSize;
  });

  // Canvas mouse events
  canvas.on('mouse:down', (options) => {
    const pointer = canvas.getPointer(options.e);
    
    if (currentTool === 'select') return;
    
    isDrawing = true;
    startPoint = pointer;

    switch (currentTool) {
      case 'rectangle':
      case 'circle':
      case 'triangle':
      case 'line':
        // These will be handled in mouse:move
        break;
        
      case 'draw':
        const path = new fabric.Path(`M ${pointer.x} ${pointer.y}`, {
          stroke: currentColor,
          strokeWidth: currentSize,
          fill: 'transparent',
          selectable: false
        });
        canvas.add(path);
        path.pathOffset = { x: 0, y: 0 };
        canvas.setActiveObject(path);
        break;
        
      case 'text':
        currentText = new fabric.IText('Type here...', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: 'Arial',
          fontSize: 20,
          fill: currentColor,
          hasControls: true
        });
        canvas.add(currentText);
        currentText.enterEditing();
        currentText.selectAll();
        break;
        
      case 'measure':
        measureStart = pointer;
        measureLine = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y], 
          {
            stroke: '#00ff00',
            strokeWidth: 2,
            selectable: false,
            evented: false
          }
        );
        canvas.add(measureLine);
        break;
        
      case 'blood':
        createBloodSplatter(pointer.x, pointer.y);
        break;
        
      case 'chair':
      case 'sofa':
      case 'door':
      case 'table':
        addFurniture(currentTool, pointer.x, pointer.y);
        break;
    }
  });

  canvas.on('mouse:move', (options) => {
    if (!isDrawing) return;
    const pointer = canvas.getPointer(options.e);
    
    switch (currentTool) {
      case 'rectangle':
        drawRectangle(startPoint, pointer);
        break;
      case 'circle':
        drawCircle(startPoint, pointer);
        break;
      case 'triangle':
        drawTriangle(startPoint, pointer);
        break;
      case 'line':
        drawLine(startPoint, pointer);
        break;
      case 'draw':
        const activePath = canvas.getActiveObject();
        if (activePath && activePath.type === 'path') {
          activePath.path.push(['L', pointer.x, pointer.y]);
          activePath.set({ dirty: true });
          canvas.renderAll();
        }
        break;
      case 'measure':
        if (measureLine) {
          measureLine.set({ x2: pointer.x, y2: pointer.y });
          
          // Calculate distance
          const dx = pointer.x - measureStart.x;
          const dy = pointer.y - measureStart.y;
          const distance = Math.sqrt(dx*dx + dy*dy).toFixed(1);
          
          // Position tooltip
          measureTooltip.style.display = 'block';
          measureTooltip.style.left = `${pointer.x + 10}px`;
          measureTooltip.style.top = `${pointer.y + 10}px`;
          measureTooltip.textContent = `${distance}px`;
          
          canvas.renderAll();
        }
        break;
    }
  });

  canvas.on('mouse:up', () => {
    isDrawing = false;
    startPoint = null;
    
    if (currentTool === 'measure') {
      setTimeout(() => {
        measureTooltip.style.display = 'none';
        if (measureLine) {
          canvas.remove(measureLine);
          measureLine = null;
        }
      }, 1000);
    }
  });

  // Shape drawing functions
  function drawRectangle(start, end) {
    const rect = new fabric.Rect({
      left: start.x,
      top: start.y,
      width: end.x - start.x,
      height: end.y - start.y,
      stroke: currentColor,
      strokeWidth: currentSize,
      fill: currentFill,
      transparentCorners: false
    });
    
    canvas.remove(canvas.getActiveObject());
    canvas.add(rect);
    canvas.setActiveObject(rect);
  }

  function drawCircle(start, end) {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + 
      Math.pow(end.y - start.y, 2)
    ) / 2;
    
    const circle = new fabric.Circle({
      left: start.x,
      top: start.y,
      radius: radius,
      stroke: currentColor,
      strokeWidth: currentSize,
      fill: currentFill,
      transparentCorners: false
    });
    
    canvas.remove(canvas.getActiveObject());
    canvas.add(circle);
    canvas.setActiveObject(circle);
  }

  function drawTriangle(start, end) {
    const triangle = new fabric.Triangle({
      left: start.x,
      top: start.y,
      width: end.x - start.x,
      height: end.y - start.y,
      stroke: currentColor,
      strokeWidth: currentSize,
      fill: currentFill,
      transparentCorners: false
    });
    
    canvas.remove(canvas.getActiveObject());
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
  }

  function drawLine(start, end) {
    const line = new fabric.Line(
      [start.x, start.y, end.x, end.y], 
      {
        stroke: currentColor,
        strokeWidth: currentSize,
        fill: currentFill,
        transparentCorners: false
      }
    );
    
    canvas.remove(canvas.getActiveObject());
    canvas.add(line);
    canvas.setActiveObject(line);
  }

  // Furniture functions
  function addFurniture(type, x, y) {
    let obj;
    const size = 60;
    
    switch (type) {
      case 'chair':
        obj = new fabric.Rect({
          left: x,
          top: y,
          width: size,
          height: size,
          fill: '#8B4513',
          stroke: '#654321',
          strokeWidth: 2,
          rx: 5,
          ry: 5
        });
        break;
      case 'sofa':
        obj = new fabric.Rect({
          left: x,
          top: y,
          width: size * 2,
          height: size,
          fill: '#A0522D',
          stroke: '#654321',
          strokeWidth: 2,
          rx: 10,
          ry: 10
        });
        break;
      case 'door':
        obj = new fabric.Rect({
          left: x,
          top: y,
          width: size / 2,
          height: size * 1.5,
          fill: '#D2B48C',
          stroke: '#8B4513',
          strokeWidth: 2
        });
        // Add door handle
        const handle = new fabric.Circle({
          left: x + size/2 - 10,
          top: y + size/2,
          radius: 3,
          fill: '#000000',
          originX: 'left',
          originY: 'top'
        });
        canvas.add(handle);
        break;
      case 'table':
        obj = new fabric.Rect({
          left: x,
          top: y,
          width: size * 1.5,
          height: size,
          fill: '#D2B48C',
          stroke: '#8B4513',
          strokeWidth: 2
        });
        break;
    }
    
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
    }
  }

  // Blood splatter effect
  function createBloodSplatter(x, y) {
    const splatter = new fabric.Group([], {
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      selectable: true
    });
    
    // Main blood pool
    const pool = new fabric.Circle({
      radius: 10 + Math.random() * 10,
      fill: '#8A0303',
      stroke: '#5A0000',
      strokeWidth: 1,
      originX: 'center',
      originY: 'center'
    });
    splatter.addWithUpdate(pool);
    
    // Blood drops
    const dropCount = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < dropCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 30;
      const size = 2 + Math.random() * 5;
      
      const drop = new fabric.Circle({
        radius: size,
        left: Math.cos(angle) * distance,
        top: Math.sin(angle) * distance,
        fill: '#8A0303',
        originX: 'center',
        originY: 'center'
      });
      splatter.addWithUpdate(drop);
    }
    
    // Blood streaks
    const streakCount = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < streakCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = 10 + Math.random() * 20;
      const width = 1 + Math.random() * 3;
      
      const streak = new fabric.Rect({
        width: length,
        height: width,
        angle: angle * 180 / Math.PI,
        fill: '#8A0303',
        originX: 'left',
        originY: 'center'
      });
      splatter.addWithUpdate(streak);
    }
    
    canvas.add(splatter);
    canvas.setActiveObject(splatter);
  }

  // Action buttons
  deleteBtn.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire scene?')) {
      canvas.clear();
      canvas.backgroundColor = '#333333';
      canvas.renderAll();
    }
  });

  undoBtn.addEventListener('click', () => {
    // Simple undo - removes last added object
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1]);
    }
  });

  // Save/Load functionality
  saveBtn.addEventListener('click', () => {
    const sceneData = JSON.stringify(canvas);
    localStorage.setItem('crimeScene', sceneData);
    alert('Scene saved successfully!');
  });

  loadBtn.addEventListener('click', () => {
    const sceneData = localStorage.getItem('crimeScene');
    if (sceneData) {
      canvas.clear();
      canvas.loadFromJSON(sceneData, () => {
        canvas.renderAll();
      });
    } else {
      alert('No saved scene found!');
    }
  });

  exportBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = 'crime-scene.png';
    link.href = dataURL;
    link.click();
  });

  // Background image upload
  bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        // Scale image to fit canvas
        img.scaleToWidth(canvas.getWidth());
        img.scaleToHeight(canvas.getHeight());
        img.set({ selectable: false, evented: false });
        
        // Add to back of all objects
        canvas.add(img);
        canvas.sendToBack(img);
      });
    };
    reader.readAsDataURL(file);
  });

  // Initialize with select tool active
  document.querySelector('[data-tool="select"]').classList.add('active');
});