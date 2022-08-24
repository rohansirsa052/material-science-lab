const canvas = document.getElementById("gui");
var menu = document.querySelector(".menu");
var main = document.querySelector(".main");
var slider = document.getElementById("slider");

var dragging = false;
var draggedElement;

var vernierCaliper;
var bgColor = "rgb(0,64,84)";
var fgColor = "orange";
var ctx;
// var canvasWidthRatio = 0.78;
var utm = null;
var vc = null;
// var canvasWidth = main.innerWidth - 10;
var canvasWidth = main.offsetWidth - 20;
var canvasHeight = main.offsetHeight - 20;

function init() {
  ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.lineWidth = 1.5;
  // canvas.width = window.innerWidth * devicePixelRatio;
  // canvas.height = window.innerHeight * devicePixelRatio;
  // canvas.style.width = window.innerWidth * canvasWidthRatio + "px";
  // canvas.style.height = window.innerHeight + "px";
  // scale = canvas.width / 8000;

  // vernierCaliper = VernierCaliper(canvas, ctx);

  utm = UTM(canvas, ctx);
  // utm.init();

  vc = VernierCaliper(canvas, ctx);
  // vc.init();

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
    for (i = 0; i < canvas.width; i += 50) {
      for (j = 0; j < canvas.height; j += 50) {
        ctx.fillStyle = "rgb(160,160,160)";
        ctx.fillRect(i, j, 3, 3);
      }
    }
    // ctx.fillStyle = "#2b2b2b";
    // ctx.fillStyle = "#000000";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (vc) vc.paint();
    if (utm) utm.paint();
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
}

function onMouseMoveHandler(event) {
  if (utm) utm.onMouseMoveHandler(event);
  if (vc) vc.onMouseMoveHandler(event);
}

function onMouseUpHandler(event) {
  if (utm) utm.onMouseUpHandler(event);
  if (vc) vc.onMouseUpHandler(event);
}

function onContextMenuHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (utm) utm.onContextMenuHandler(event);
  if (vc) vc.onContextMenuHandler(event);
  // console.log(clientX, clientY);
}

function onClickHandler(event) {
  if (utm) utm.onClickHandler(event);
  if (vc) vc.onClickHandler(event);
}

function onMouseWheelHandler(event) {
  if (utm) utm.onMouseWheelHandler(event);
  if (vc) vc.onMouseWheelHandler(event);
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
  }
}

window.onload = init;

slider.addEventListener("mousedown", () => (dragging = true));
document.addEventListener("mousemove", slideWindow);
document.addEventListener("mouseup", () => (dragging = false));

slider.addEventListener("touchstart", (e) => {
  dragging = true;
});

document.addEventListener("touchstart", (e) => {
  // draggedElement = e.touches[0].target;
  console.log(draggedElement);
  if (draggedElement) {
    draggedElement.remove();
    draggedElement = null;
  }
  tar = e.touches[0].target;
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
  // if (draggedElement.id == "vernierCaliper" || draggedElement.id == "utmMachine") {

  //   draggedElement.style.position = "absolute";
  //   draggedElement.style.left = e.touches[0].clientX + "px";
  //   draggedElement.style.top = e.touches[0].clientY + "px";
  // }
});

document.addEventListener("touchend", () => {
  dragging = false;
  if (draggedElement) {
    draggedElement.style.display = "none";
  }
});

// document.addEventListener("touch", (evt)=>{console.log(evt);})
// document.addEventListener("touchmove")

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
