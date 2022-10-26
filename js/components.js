function VernierCaliper(canvas, ctx) {
  let assetPath = "assets/vc/";
  let sampleAssetPath = "assets/vc/";
  if(typeof SAMPLE_ASSETS_PATH !== 'undefined'){
    sampleAssetPath = SAMPLE_ASSETS_PATH;
  }
  let itemsToLoad = 12;
  var fgColor = "orange";
  let itemsLoaded = 0;
  let imgVernier = new Image();
  let imgVernier1 = new Image();
  let imgVernier2 = new Image();
  let imgVernier3 = new Image();
  let imgBlade = new Image();
  let imgBase = new Image();
  let imgVlab = new Image();
  let imgSampleH = new Image();
  let imgSampleV = new Image();
  let imgSampleCrackedH = new Image();
  let imgSampleCrackedV = new Image();
  let xOffset = 50;
  let yOffset = 90;
  let scale = 0.5;
  let dragMode = 0; /* 0 = no drag, 1 = drag machine, */
  let isActive = false;
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];

  // var msr = 0;
  // var vsr = 0;
  // var vernierScaleDivisions = 10;
  const mainScaleLengthPixels = 600; //600
  // var msd_pixels = mainScaleLengthPixels / mainScaleDivisions;
  // var mainScaleDivisions = 50;
  const rulerWidthPixel = 915;
  const bladeWidthPixel = 716;
  const scaleOriginY0 = 105; //scale top position
  const scaleOriginY = 162; //scale bottom position
  const bladeHeightPixel = 20;
  const scaleOriginX = 67; //jaw Left position
  const offsetOriginX = 12; //distance of scale origin level from scaleOriginX
  const scaleColor = "black";

  var zeroError = 0;
  //distance of scale origin level from scaleOriginX
  const vernierOriginX = 55; //distance of vernier origin in pixel in vernier.png
  const vernierOriginY = 161;

  const majorTickLengthPixels = 22;
  const minorTickLengthPixels = 13;
  const vernierMajorTickLengthPixels = 10;
  const vernierMinorTickLengthPixels = 8;

  const vernierScaleHeightPixels = 354;
  const rulerMidPointY = 135;

  const unit = "mm";
  var mainScaleDivisions = 100;
  var msdValue = 1;
  var vernierScaleDivisions = 20;
  var msd_pixels = mainScaleLengthPixels / mainScaleDivisions;
  var vsd_pixels = 5
  let vsdValue = 1/2;
  var vernierScaleLengthPixels = 200;

  var precision = 2;
  // var LC = 0;
  var LC = 0.01;
  var msr = 0;
  var vsr = 0;
  var zeroError = 0;
  var displayInfo = false;
  var objectWidthPixel = 25;
  var drawSubDivision = false;
  var randomZeroError = true;
  var randomMainScaleDivisions = true;
  var randomVernierScaleDivision = true;
  var randomObjectWidthPixel = true;
  var objectTobeMeasured = {
    path: null,
    x: 0,
    y: 0,
    length: 100,
    w: 100,
    h: 100,
    R1: 30,
    R2: 50,
    h2: 100,
    h1: 80,
    th: 0,
    mode: 0,
    state: 0,
  }; //state =0=hide, 1= visible but not snapped, 2=snapped

  let sampleLoaded = 0; // 0=not loaded, 1=loaded horizontal, 2=loaded vertical

  var contextMenu;
  var contextMenuInstance;

  let startX;
  let startY;

  imgVernier.src = assetPath + "vernier.png";
  imgVernier.onload = itemsLoaded++;

  imgVernier1.src = assetPath + "vernier1.png";
  imgVernier1.onload = itemsLoaded++;

  imgVernier2.src = assetPath + "vernier2.png";
  imgVernier2.onload = itemsLoaded++;

  imgVernier3.src = assetPath + "vernier3.png";
  imgVernier3.onload = itemsLoaded++;

  imgBlade.src = assetPath + "blade.png";
  imgBlade.onload = itemsLoaded++;

  imgBase.src = assetPath + "vernier_base.png";
  imgBase.onload = itemsLoaded++;

  imgVlab.src = assetPath + "vlab-logo-sm.png";
  imgVlab.onload = itemsLoaded++;

  imgSampleH.src = sampleAssetPath + "sample1-h.png";
  imgSampleH.onload = itemsLoaded++;

  imgSampleV.src = sampleAssetPath + "sample1-v.png";
  imgSampleV.onload = itemsLoaded++;

  imgSampleCrackedH.src = sampleAssetPath + "sample1-cracked-h.png";
  imgSampleCrackedH.onload = itemsLoaded++;

  imgSampleCrackedV.src = sampleAssetPath + "sample1-cracked-v.png";
  imgSampleCrackedV.onload = itemsLoaded++;

  var tickSound = new Audio(assetPath + "tick.wav");
  tickSound.onload = itemsLoaded++;

  const init = () => {
    isActive = true;
    xOffset = 50;
    yOffset = 90;
    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;

    ctx.translate(xOffset, yOffset);
    ctx.scale(scale * devicePixelRatio, scale * devicePixelRatio);
    ctx.save();

    // draw sample
    if (sampleLoaded == 1) {
      let x = -15;
      let y = 342;

      let currentSample = imgSampleH;
      if (utm && utm.getSampleState() == 2) {
        currentSample = imgSampleCrackedH;
      }

      ctx.drawImage(currentSample, x, y, currentSample.width / 2, currentSample.height / 2);
    } else if (sampleLoaded == 2) {
      let x = 57;
      let y = 160;

      let currentSample = imgSampleV;
      if (utm && utm.getSampleState() == 2) {
        x = 55;
        currentSample = imgSampleCrackedV;
      }

      ctx.drawImage(currentSample, x, y, currentSample.width / 1.1, currentSample.height / 1.1);
    }

    //draw  blade first
    let shift = (msr + vsr / vernierScaleDivisions) * msd_pixels;
    let x = rulerWidthPixel + shift - bladeWidthPixel;
    let y = (scaleOriginY0 + scaleOriginY) / 2 - bladeHeightPixel / 2;
    ctx.drawImage(imgBlade, x, y);

    //draw Base of gauge
    ctx.drawImage(imgBase, 0, 0);

    //draw ruler on main scale
    ctx.translate(scaleOriginX + offsetOriginX, scaleOriginY);

    ctx.fillStyle = scaleColor; //"rgb(210,210,210)";
    ctx.strokeStyle = scaleColor;
    (x = (-msd_pixels * zeroError) / vernierScaleDivisions), (y = 0);
    let ticklength = 0;
    let labelGap = 0;
    while (msd_pixels * labelGap < 50) {
      labelGap += 5;
    }
    for (let i = 0; i <= mainScaleDivisions; i++) {
      ticklength = i % 5 == 0 ? majorTickLengthPixels : minorTickLengthPixels;
      drawLine(x, y, x, y - ticklength);
      if (i % labelGap == 0) outString(x, y - ticklength - 3, i * msdValue, 1, 2);
      x += msd_pixels;
    }

    if (drawSubDivision) {
      ctx.lineWidth = 0.5;
      let dx = msd_pixels / vernierScaleDivisions;
      let x = (-msd_pixels * zeroError) / vernierScaleDivisions + getMainScaleReading() * msd_pixels;
      ticklength = minorTickLengthPixels - 3;
      for (let i = 0; i <= vernierScaleDivisions; i++) {
        drawLine(x, y, x, y - ticklength);
        x += dx;
      }
      ctx.lineWidth = 1.5;
    }

    ctx.restore();
    ctx.strokeStyle = scaleColor;
    ctx.fillStyle = scaleColor;

    //ctx.translate(scaleOriginX+shift,scaleOriginY)
    outString(844, 117, "1 MSD = " + msdValue + unit, 1, 0);
    ctx.fillStyle = fgColor;
    outString(844, 135, "Virtual Lab", 1, 0);
    ctx.fillStyle = scaleColor;
    //draw Vernier scale
    x = scaleOriginX - offsetOriginX + shift - vernierOriginX;
    y = scaleOriginY - vernierOriginY;
    ctx.drawImage(imgVernier1, x, y);
    let w = vernierScaleLengthPixels - imgVernier1.width - imgVernier3.width;
    if (w > 0) {
      let h = imgVernier1.height;
      ctx.drawImage(imgVernier2, 0, 0, w, h, x + imgVernier1.width, y, w, h);
    }

    ctx.drawImage(imgVernier3, x + imgVernier1.width + w, y);

    x = scaleOriginX + shift + offsetOriginX;
    y = vernierOriginY - 1;
    ctx.font = "8pt sans-serif";

    let N = vernierScaleDivisions;

    labelGap = 0;
    while (vsd_pixels * labelGap < 20) {
      labelGap += 1;
    }
    for (let i = 0; i <= N; i++) {
      ticklength = vernierMinorTickLengthPixels;
      if (i % labelGap == 0) {
        ticklength = vernierMajorTickLengthPixels;
        outString(x, y + ticklength + 1, i*vsdValue, 1, 0);
      }
      drawLine(x, y, x, y + ticklength);
      x += vsd_pixels;
    }
    ctx.fillStyle = fgColor;
    ctx.font = "12pt sans-serif";

    //draw Base of gauge
    ctx.drawImage(imgBase, 0, 0, 64, 102, 0, 0, 64, 102);
    if (objectTobeMeasured.state > 0) {
      ctx.save();
      ctx.fillStyle = "rgb(130,190,140)";
      ctx.strokeStyle = scaleColor;
      ctx.translate(objectTobeMeasured.x, objectTobeMeasured.y);
      ctx.rotate(objectTobeMeasured.th);
      ctx.fill(objectTobeMeasured.path);
      ctx.stroke(objectTobeMeasured.path);
      ctx.restore();
    }

    ctx.resetTransform();
  };

  const isInside = ({ x, y }) => {
    boundary = {
      xmin: xOffset + 0 * scale,
      xmax: xOffset + 1100 * scale,
      ymin: yOffset + 50 * scale,
      ymax: yOffset + 350 * scale,
    };

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);
    // ctx.fillRect(xOffset, yOffset, 5, 5);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const isInsideHandle = ({ x, y }) => {
    // let shift = (msr + vsr / vernierScaleDivisions) * msd_pixels;
    let shift = scaleOriginX + (msr + vsr / vernierScaleDivisions) * msd_pixels;
    // console.log(shift);
    let sc = scale * devicePixelRatio;
    boundary = {
      xmin: xOffset + shift * sc,
      xmax: xOffset + (shift + imgVernier1.width - 60) * sc,
      ymin: yOffset + (scaleOriginY - 100) * sc,
      ymax: yOffset + vernierScaleHeightPixels * sc,
    };

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);
    // ctx.fillRect(xOffset, yOffset, 5, 5);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function translateVernier(div) {
    vsr += div;
    if (vsr < 0) {
      vsr = vernierScaleDivisions + vsr;
      msr -= 1;
    } else if (vsr >= vernierScaleDivisions) {
      vsr = vsr - vernierScaleDivisions;
      msr += 1;
    }
    let correctedReading = getCorrectedReading();

    if (correctedReading <= 0) {
      msr = 0;
      vsr = 0;
      // tickSound.muted = false;
      // if (tickSound.paused) tickSound.play();
    }
    if (correctedReading >= mainScaleDivisions * msdValue) {
      msr = mainScaleDivisions;
      vsr = 0;
      // tickSound.muted = false;
      // if (tickSound.paused) tickSound.play();
    }

    ctx.refresh();
  }

  function getCorrectedReading() {
    return (msr + vsr / vernierScaleDivisions) * msdValue;
  }

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  const onMouseDownHandler = (event) => {
    if (isInsideHandle(getMouseCoords(event))) {
      dragMode = 2;
      startX = event.clientX;
    } else if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
    }
  };

  const onMouseUpHandler = (event) => {
    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;

    let dx = (event.clientX - startX) / scale;
    startX = event.clientX;

    if (dragMode == 2) {
      //move vernier
      if (msr >= mainScaleDivisions && dx > 0) {
        ctx.refresh();
        return;
      }
      if (msr == 0 && vsr == 0 && dx < 0) {
        ctx.refresh();
        return;
      }

      translateVernier(Math.round(dx));
    } else if (dragMode == 1) {
      let { x, y } = getMouseCoords(event);
      xOffset = x - 20;
      yOffset = y - 10;
      ctx.refresh();
    }
  };

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.1, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(1, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (isActive && contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      let menuItems = [
        {
          content: `${ContextMenu.deleteIcon}Delete`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: destory,
          },
        },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
      ];

      if (sampleLoaded) {
        menuItems.push({
          content: `${ContextMenu.deleteIcon}Unload Sample`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              sampleLoaded = 0;
              sample1.init();
              ctx.refresh();
            },
          },
        });
      }

      contextMenu.setMenuItems(menuItems);
      contextMenuInstance = contextMenu.show(event);
    }
    return true;
  };

  function outString(x, y, s, x_align, y_align) {
    var fm = ctx.measureText(s);
    var h = 10; //fm.height not supported in browsers
    switch (y_align) {
      case 0:
        y += h;
        break;
      case 1:
        y += h / 2;
        break;
      case 2:
        break;
    }
    switch (x_align) {
      case 0:
        ctx.fillText(s, x + 3, y);
        break;
      case 1:
        ctx.fillText(s, x - fm.width / 2, y);
        break;
      case 2:
        ctx.fillText(s, x - fm.width / 2, y);
        break;
    }
  }

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    isActive: () => isActive,
    isInside: isInside,
    loadSample1: (val) => {
      sampleLoaded = val;
    },
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}

function UTM(canvas, ctx) {
  let assetPath = "assets/utm/";
  let itemsToLoad = 7;
  let itemsLoaded = 0;
  let imgUTM1 = new Image();
  let imgUTM2 = new Image();
  let imgUTMPiller1 = new Image();
  let imgUTMPiller2 = new Image();
  let sample = new Image();
  let sampleNecked = new Image();
  let sampleCracked = new Image();
  let xOffset = 30;
  let yOffset = 400;
  let yMovement = 0; /* 0 to 1 */
  let dragMode = 0; /* 0 = no drag, 1 = drag machine, */
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let sampleLoaded = false;
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
  let utmPlayRef = null;
  let currentSampleState = 0; //0: no crack; 1: necked; 2:cracked
  let currentDialReading = 0;
  let currentLoad = 0;
  let config = {
    'yield_point': 0.7,
    'breaking_point': 0.9,
    'finish_point': 1
  }

  let scale = 0.5;

  // let startX = 0;
  // let startY = 0;

  let isActive = false;

  imgUTM1.src = assetPath + "utm1.png";
  imgUTM1.onload = itemsLoaded++;

  imgUTM2.src = assetPath + "utm2.png";
  imgUTM2.onload = itemsLoaded++;

  imgUTMPiller1.src = assetPath + "utm3.png";
  imgUTMPiller1.onload = itemsLoaded++;
  imgUTMPiller2.src = assetPath + "utm3.png";
  imgUTMPiller2.onload = itemsLoaded++;

  sample.src = assetPath + "sample1.png";
  sample.onload = itemsLoaded++;

  sampleNecked.src = assetPath + "sample1-necked.png";
  sampleNecked.onload = itemsLoaded++;

  sampleCracked.src = assetPath + "sample1-cracked.png";
  sampleCracked.onload = itemsLoaded++;

  var contextMenu;
  var contextMenuInstance = null;

  const init = () => {
    isActive = true;
    xOffset = 30;
    yOffset = 400;

    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;

    if (sampleLoaded) {
      let currentSample = sample;
      currentSampleState = 0;

      if (yMovement > config.breaking_point) {
        currentSample = sampleCracked;
        currentSampleState = 2;
      } else if (yMovement > config.yield_point) {
        currentSample = sampleNecked;
        currentSampleState = 1;
      }

      x = (xOffset + 227) * scale;

      let yStart = (yOffset + 485 - yMovement * 90) * scale;
      let yEnd = (50 + yMovement * 90) * scale;
      ctx.drawImage(currentSample, x, yStart, (sample.width * scale) / 4, yEnd);
    }

    x = (xOffset + 105) * scale;
    y = (yOffset + 180) * scale;
    ctx.drawImage(imgUTMPiller1, x, y, imgUTMPiller1.width * scale, imgUTMPiller1.height * scale);

    x = (xOffset + 295) * scale;
    y = (yOffset + 180) * scale;
    ctx.drawImage(imgUTMPiller2, x, y, imgUTMPiller2.width * scale, imgUTMPiller2.height * scale);

    x = (xOffset + 68) * scale;
    let shift = yMovement * 90 - 120;
    y = (yOffset - shift) * scale;
    ctx.drawImage(imgUTM2, x, y, imgUTM2.width * scale, imgUTM2.height * scale);

    (x = xOffset * scale), (y = (yOffset + 500) * scale);
    ctx.drawImage(imgUTM1, x, y, imgUTM1.width * scale, imgUTM1.height * scale);

    ctx.save();
  };

  const start = (speed, direction) => {
    // speed 0 to 1
    // direction -1:down, 1: up

    if (direction == -1) {
      utmPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement -= step;

        if (yMovement <= 0) {
          clearInterval(utmPlayRef);
          return;
        }

        ctx.refresh();
      }, 100);
    } else {
      utmPlayRef = setInterval(() => {
        step = speed * 0.05;
        yMovement += step;
        currentLoad += 0.5;
        currentDialReading = currentLoad * Math.round(5 * yMovement);

        if (yMovement >= config.finish_point) {
          clearInterval(utmPlayRef);
          utmPlayRef = null;
          return;
        }

        ctx.refresh();
      }, 100);
    }
  };

  const stop = () => {
    if (utmPlayRef) {
      clearInterval(utmPlayRef);
      utmPlayRef = null;
    }
  };

  const isInside = ({ x, y }) => {
    boundary = {
      xmin: (xOffset + 50) * scale,
      xmax: (xOffset + 400) * scale,
      ymin: (yOffset + 80) * scale,
      ymax: (yOffset + 900) * scale,
    };

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseDownHandler = (event) => {
    if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
      return;
    }
  };

  const onMouseUpHandler = (event) => {
    // if(dragMode == 0){
    //   return;
    // }
    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;
    const rect = canvas.getBoundingClientRect();
    // let x = event.clientX - rect.left;
    // let y = event.clientY - rect.top;
    let { x, y } = getMouseCoords(event);

    // ctx.fillRect(x, y, 5, 5);
    // // ctx.refresh();
    // return;

    // let dx = (x - startX)/scale;
    // let dy = (y - startY)/scale;

    if (dragMode == 1) {
      // xOffset += dx;
      // yOffset += dy;
      xOffset = (x - 200 * scale) / scale;
      yOffset = (y - 500 * scale) / scale;

      ctx.refresh();

      // startX = x;
      // startY = y;
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.1, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(2, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (isActive && contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      let menuItems = [
        {
          content: `${ContextMenu.deleteIcon}Delete`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: destory,
          },
        },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
      ];

      if (sampleLoaded) {
        menuItems.push({
          content: `${ContextMenu.deleteIcon}Unload Sample`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              sampleLoaded = 0;
              sample1.init();
              ctx.refresh();
            },
          },
        });
      }

      contextMenu.setMenuItems(menuItems);
      contextMenuInstance = contextMenu.show(event);
    }
    return true;
  };

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    start: start,
    stop: stop,
    isActive: () => isActive,
    isInside: isInside,
    setConfig: (conf) => {
      config = conf;
    },
    isRunning: () => (utmPlayRef ? true : false),
    loadSample1: () => {
      sampleLoaded = true;
      yMovement = 0.55;
    },
    getLoad: () => currentLoad,
    getDialReading: () => currentDialReading,
    isSampleLoaded: () => sampleLoaded,
    getSampleState: () => currentSampleState,
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}

function Sample1(canvas, ctx) {
  let assetPath = "assets/sample/";
  if(typeof SAMPLE_ASSETS_PATH !== 'undefined'){
    assetPath = SAMPLE_ASSETS_PATH;
  }

  let itemsToLoad = 3;
  let itemsLoaded = 0;
  let sample1 = new Image();
  let sample1Cracked = new Image();
  let sample1Necked = new Image();
  let xOffset = 40;
  let yOffset = 120;
  let yMovement = 0; /* 0 to 1 */
  let dragMode = 0; /* 0 = no drag, 1 = drag machine, */
  let isFixed = 0; /* 0=draggable; 1=not draggable */
  let rotate = 0; /* 0=horizontal; 1=vertical */
  let menuPinText = ["Pin", "Unpin"];
  let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
  let menuRotateText = ["Rotate", "Rotate back"];
  let menuRotateIcon = [ContextMenu.rotateRight, ContextMenu.rotateLeft];

  let scale = 0.4;

  let isActive = false;

  sample1.src = assetPath + "sample1.png";
  sample1.onload = itemsLoaded++;
  sample1Necked.src = assetPath + "sample1-necked.png";
  sample1Necked.onload = itemsLoaded++;
  sample1Cracked.src = assetPath + "sample1-cracked.png";
  sample1Cracked.onload = itemsLoaded++;

  var contextMenu;
  var contextMenuInstance = null;

  const init = () => {
    isActive = true;
    xOffset = 40;
    yOffset = 120;

    if (itemsLoaded >= itemsToLoad) {
      ctx.refresh();
    }

    contextMenu = new ContextMenu();
  };

  const paint = () => {
    if (!isActive) return;

    ctx.save();

    x = xOffset * scale;
    y = yOffset * scale;

    if (rotate) {
      x = -x;
      y = -y;
      ctx.rotate((90 * Math.PI) / 180);
    }

    let currentSample = sample1;
    if (utm) {
      if (utm.getSampleState() == 1) {
        currentSample = sample1Necked;
      } else if (utm.getSampleState() == 2) {
        currentSample = sample1Cracked;
      }
    }

    ctx.drawImage(currentSample, x, y, sample1.width * scale, sample1.height * scale);
    ctx.restore();
  };

  const start = (speed, direction) => {
    // speed 0 to 1
    // direction -1:down, 1: up

    if (direction == -1) {
      let ref = setInterval(() => {
        step = speed * 0.05;
        yMovement -= step;

        if (yMovement <= 0) {
          clearInterval(ref);
          return;
        }

        ctx.refresh();
      }, 100);
    } else {
      let ref = setInterval(() => {
        step = speed * 0.05;
        yMovement += step;

        if (yMovement >= 1) {
          clearInterval(ref);
          return;
        }

        ctx.refresh();
      }, 100);
    }
  };

  const isInside = ({ x, y }) => {
    if (rotate) {
      boundary = {
        ymin: (-xOffset + 10) * scale,
        ymax: (-xOffset + 750) * scale,
        xmin: (yOffset - 100) * scale,
        xmax: (yOffset + 5) * scale,
      };
    } else {
      boundary = {
        xmin: (xOffset + 10) * scale,
        xmax: (xOffset + 750) * scale,
        ymin: yOffset * scale,
        ymax: (yOffset + 100) * scale,
      };
    }

    // ctx.fillRect(boundary.xmin, boundary.ymin, boundary.xmax - boundary.xmin, boundary.ymax - boundary.ymin);

    if (x > boundary.xmin && x < boundary.xmax && y > boundary.ymin && y < boundary.ymax) {
      return true;
    }
  };

  const getMouseCoords = (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) * devicePixelRatio;
    let y = (event.clientY - rect.top) * devicePixelRatio;
    return { x: x, y: y };
  };

  const onClickHandler = (event) => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }
  };

  const onMouseDownHandler = (event) => {
    if (isFixed == 0 && isInside(getMouseCoords(event))) {
      dragMode = 1;
      return;
    }
  };

  const onMouseUpHandler = (event) => {
    if (dragMode == 1) {
      if (utm && utm.isActive() && utm.isInside(getMouseCoords(event))) {
        utm.loadSample1();
        destory();
      } else if (vc && vc.isActive() && vc.isInside(getMouseCoords(event))) {
        vc.loadSample1(rotate + 1);
        destory();
      }
      ctx.refresh();
    }

    dragMode = 0;
  };

  const onMouseMoveHandler = (event) => {
    if (dragMode == 0) return;

    let { x, y } = getMouseCoords(event);

    if (dragMode == 1) {
      if (rotate) {
        xOffset = -(y - 20 * scale) / scale;
        yOffset = (x + 50 * scale) / scale;
      } else {
        xOffset = (x - 100 * scale) / scale;
        yOffset = (y + 10 * scale) / scale;
      }
      ctx.refresh();
    }
  };

  const onMouseWheelHandler = (event) => {
    if (isActive && isInside(getMouseCoords(event))) {
      let { deltaY } = event;
      if (deltaY > 0) {
        // scale down the image
        scale = Math.max(0.1, scale - 0.05);
      } else {
        // scale up (zoom)
        scale = Math.min(2, scale + 0.05);
      }
      ctx.refresh();
    }
  };

  const onContextMenuHandler = (event) => {
    if (isActive && contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    if (isActive && isInside(getMouseCoords(event))) {
      contextMenu.setMenuItems([
        {
          content: `${ContextMenu.deleteIcon}Delete`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: destory,
          },
        },
        {
          content: `${menuPinIcon[isFixed]}${menuPinText[isFixed]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              // toggle
              isFixed = isFixed ? 0 : 1;
              ctx.refresh();
            },
          },
        },
        {
          content: `${menuRotateIcon[rotate]}${menuRotateText[rotate]}`,
          divider: "top", // top, bottom, top-bottom
          events: {
            click: () => {
              if (contextMenuInstance) {
                contextMenu.closeMenu(contextMenuInstance);
              }

              rotate = rotate == 0 ? 1 : 0;

              xOffset = -rotate * 30 + 10;
              yOffset = 120;

              ctx.refresh();
            },
          },
        },
      ]);
      contextMenuInstance = contextMenu.show(event);
    }
    return true;
  };

  const destory = () => {
    if (contextMenuInstance) {
      contextMenu.closeMenu(contextMenuInstance);
    }

    isActive = false;
    ctx.refresh();
  };

  return {
    init: init,
    start: start,
    isActive: () => isActive,
    setAssetsPath: (path) => {
      assetPath = path;
    },
    onMouseDownHandler: onMouseDownHandler,
    onMouseUpHandler: onMouseUpHandler,
    onMouseMoveHandler: onMouseMoveHandler,
    onContextMenuHandler: onContextMenuHandler,
    onClickHandler: onClickHandler,
    onMouseWheelHandler: onMouseWheelHandler,
    paint: paint,
    destory: destory,
  };
}
