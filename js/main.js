const canvas = document.getElementById("gui");
const menu = document.querySelector(".menu");
const main = document.querySelector(".main");
const slider = document.getElementById("slider");

var dragging = false;
var draggedElement;
var ctx;

var utm = null;
var vc = null;
var sample1 = null;

var canvasWidth = main.offsetWidth - 20;
var canvasHeight = main.offsetHeight - 20;

function init() {
  ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.lineWidth = 1.5;

  utm = UTM(canvas, ctx);

  vc = VernierCaliper(canvas, ctx);

  sample1 = Sample1(canvas, ctx);

  //Add event listeners
  window.addEventListener("resize", resize);

  canvas.addEventListener("mousedown", onMouseDownHandler);
  canvas.addEventListener("mousemove", onMouseMoveHandler);
  window.addEventListener("mouseup", onMouseUpHandler);
  canvas.addEventListener("mousewheel", onMouseWheelHandler);

  canvas.addEventListener("drop", onElementDrop);
  document.addEventListener("touchend", (e) => {
    onElementDrop(e.touches[0]);
  });

  canvas.addEventListener("contextmenu", onContextMenuHandler);

  canvas.addEventListener("click", onClickHandler);

  canvas.addEventListener("touchstart", (e) => onMouseDownHandler(e.touches[0]));
  canvas.addEventListener("touchmove", (e) => onMouseMoveHandler(e.touches[0]));
  window.addEventListener("touchend", (e) => onMouseUpHandler(e.touches[0]));
  canvas.addEventListener("mousewheel", onMouseWheelHandler);
  canvas.addEventListener("drop", onElementDrop);

  ctx.refresh = () => {
    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    // draw points
    ctx.fillStyle = "rgb(160,160,160)";
    for (i = 10; i < canvas.width; i += 50) {
      for (j = 10; j < canvas.height; j += 50) {
        ctx.fillRect(i, j, 3, 3);
      }
    }

    if (vc) vc.paint();
    if (utm) utm.paint();
    if (sample1) sample1.paint();
  };

  ctx.refresh();
}

function resize() {
  if (window.innerWidth < 10 || window.innerHeight < 10) return;

  canvasWidth = main.offsetWidth - 20;
  canvasHeight = main.offsetHeight - 20;
  ctx.refresh();
}

function onMouseDownHandler(event) {
  if (utm) utm.onMouseDownHandler(event);
  if (vc) vc.onMouseDownHandler(event);
  if (sample1) sample1.onMouseDownHandler(event);
}

function onMouseMoveHandler(event) {
  if (utm) utm.onMouseMoveHandler(event);
  if (vc) vc.onMouseMoveHandler(event);
  if (sample1) sample1.onMouseMoveHandler(event);
}

function onMouseUpHandler(event) {
  if (utm) utm.onMouseUpHandler(event);
  if (vc) vc.onMouseUpHandler(event);
  if (sample1) sample1.onMouseUpHandler(event);
}

function onContextMenuHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (utm) utm.onContextMenuHandler(event);
  if (vc) vc.onContextMenuHandler(event);
  if (sample1) sample1.onContextMenuHandler(event);
}

function onClickHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (utm) utm.onClickHandler(event);
  if (vc) vc.onClickHandler(event);
  if (sample1) sample1.onClickHandler(event);
}

function onMouseWheelHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (utm) utm.onMouseWheelHandler(event);
  if (vc) vc.onMouseWheelHandler(event);
  if (sample1) sample1.onMouseWheelHandler(event);
}

function onElementDrop(event) {
  if (!draggedElement) return;

  switch (draggedElement.getAttribute("label")) {
    case "utmMachine":
      utm.init();
      break;
    case "vernierCaliper":
      vc.init();
      break;
    case "sample1":
      sample1.init();
      break;
  }
}

window.onload = init;

/* Window Controls */

slider.addEventListener("mousedown", () => (dragging = true));
document.addEventListener("mousemove", slideWindow);
document.addEventListener("mouseup", () => (dragging = false));

slider.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();

  dragging = true;
});

document.addEventListener("touchstart", (e) => {
  if (draggedElement) {
    draggedElement.remove();
    draggedElement = null;
  }

  let tar = e.touches[0].target;
  if (tar.getAttribute("label") == "utmMachine" || tar.getAttribute("label") == "vernierCaliper") {
    img = document.createElement("img");
    img.src = tar.src;
    img.setAttribute("label", tar.getAttribute("label"));
    img.onload = () => {
      document.body.appendChild(img);
      draggedElement = img;
    };
  }
});

document.addEventListener("touchmove", (e) => {
  slideWindow(e.touches[0]);
  if (!draggedElement) return;

  draggedElement.style.position = "absolute";
  draggedElement.style.left = e.touches[0].clientX + "px";
  draggedElement.style.top = e.touches[0].clientY + "px";
});

document.addEventListener("touchend", (e) => {
  dragging = false;
  if (draggedElement) {
    draggedElement.style.display = "none";
  }
});

document.addEventListener("dragstart", (event) => {
  // store a ref. on the dragged elem
  draggedElement = event.target;
});

document.addEventListener("dragover", (event) => {
  // prevent default to allow drop
  event.preventDefault();
});

function slideWindow(e) {
  if (dragging) {
    menu.style.width = e.clientX + "px";
    main.style.width = window.innerWidth - e.clientX + "px";

    canvasWidth = main.offsetWidth - 25;
    canvasHeight = main.offsetHeight - 25;
    ctx.refresh();
  }
}

window.refresh = () => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      item.classList.add("active");

      document
        .querySelectorAll(".nav-item")
        .forEach((item) => document.querySelector(item.getAttribute("data-target")).classList.remove("active"));
      document.querySelector(item.getAttribute("data-target")).classList.add("active");
    });
  });

  document.querySelectorAll(".box:not(.disabled)").forEach((e) => {
    e.addEventListener("click", () => {
      document.querySelectorAll(".box").forEach((e) => {
        e.classList.remove("active");
      });
      e.classList.toggle("active");
    });
  });
};

window.refresh();