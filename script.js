let currentZ = 1;

function createShape(type) {
  const canvas = document.getElementById("canvas");
  const shape = document.createElement("div");
  shape.classList.add("shape", type);
  shape.style.left = "50px";
  shape.style.top = "50px";
  shape.style.zIndex = currentZ++;

  const color = document.getElementById("colorPicker").value;
  shape.style.backgroundColor = color;

  if (type === "text") {
    const label = prompt("Enter text:", "Clue");
    shape.textContent = label || "Text";
  } else if (type === "chair") {
    shape.textContent = "Chair";
  } else if (type === "sofa") {
    shape.textContent = "Sofa";
  } else if (type === "door") {
    shape.textContent = "Door";
  }

  makeDraggable(shape);
  canvas.appendChild(shape);
}

function makeDraggable(el) {
  let offsetX, offsetY;
  el.addEventListener("mousedown", startDrag);
  function startDrag(e) {
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }
  function drag(e) {
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  }
  function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }

  el.style.resize = "both";
  el.style.overflow = "auto";
}

function saveCanvas() {
  const shapes = document.querySelectorAll(".shape");
  const data = [];
  shapes.forEach((el) => {
    data.push({
      type: el.classList[1],
      left: el.style.left,
      top: el.style.top,
      width: el.style.width,
      height: el.style.height,
      zIndex: el.style.zIndex,
      color: el.style.backgroundColor,
      text: el.textContent,
    });
  });
  localStorage.setItem("crimeSceneData", JSON.stringify(data));
  alert("Saved!");
}

function loadCanvas() {
  clearCanvas();
  const data = JSON.parse(localStorage.getItem("crimeSceneData"));
  if (!data) return;
  const canvas = document.getElementById("canvas");

  data.forEach((d) => {
    const el = document.createElement("div");
    el.classList.add("shape", d.type);
    el.style.left = d.left;
    el.style.top = d.top;
    el.style.width = d.width;
    el.style.height = d.height;
    el.style.zIndex = d.zIndex;
    el.style.backgroundColor = d.color;
    if (d.type === "text" || d.type === "chair" || d.type === "sofa" || d.type === "door") {
      el.textContent = d.text;
    }
    makeDraggable(el);
    canvas.appendChild(el);
  });
}

function clearCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";
}

document.getElementById("bgUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("canvas").style.backgroundImage = `url(${event.target.result})`;
    document.getElementById("canvas").style.backgroundSize = "cover";
  };
  reader.readAsDataURL(file);
});
