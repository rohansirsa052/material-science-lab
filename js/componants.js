function MIT(canvas, ctx) {
    let assetPath = "images/izod/";
    let itemsToLoad = 3;
    let itemsLoaded = 0;
    let imgMIT1 = new Image();
    let sample1Img = new Image();
    let sample2Img = new Image();
    let sample3Img = new Image();
    let arrow = new Image();
    let xOffset = 0;
    let yOffset = 0;
    let yMovement = 0; /* 0 to 1 */
    let dragMode = 0; /* 0 = no drag, 1 = drag machine, */
    let isFixed = 0; /* 0=draggable; 1=not draggable */
    let sampleLoaded = false;
    let menuPinText = ["Pin", "Unpin"];
    let menuPinIcon = [ContextMenu.pinIcon, ContextMenu.unpinIcon];
    let mitPlayRef = null;
    let currentSampleState = 0; //0: no crack; 1: necked; 2:cracked
    let currentDialReading = 0;
    let currentLoad = 0;
    let config = {
      yield_point: 0.7,
      breaking_point: 0.9,
      finish_point: 1,
    };
    let flashArrow = false; 
  
    var machineDirection = 1;
  
    let scale = 1.2;
  
    // let startX = 0;
    // let startY = 0;
  
    let isActive = false;
  
    imgMIT1.src = assetPath + "azod.png";
    imgMIT1.onload = itemsLoaded++;
  
    sample1Img.src = assetPath + "sample.png";
    sample1Img.onload = itemsLoaded++;
    // sample2Img.src = "images/sample2.png";
    // sample2Img.onload = itemsLoaded++;
    // sample3Img.src = "images/sample/steel/1.png";
    // sample3Img.onload = itemsLoaded++;
  
    arrow.src = assetPath + "arrow-h.png";
    arrow.onload = itemsLoaded++;
    // sample.src = assetPath + "sample1.png";
    // sample.onload = itemsLoaded++;
  
    // sampleNecked.src = assetPath + "sample1-necked.png";
    // sampleNecked.onload = itemsLoaded++;
  
    // sampleCracked.src = assetPath + "sample1-cracked.png";
    // sampleCracked.onload = itemsLoaded++;
  
    var contextMenu;
    var contextMenuInstance = null;
  
    const init = () => {
      isActive = true;
      xOffset = 10;
      yOffset = 10;
  
      if (itemsLoaded >= itemsToLoad) {
        ctx.refresh();
      }
  
      contextMenu = new ContextMenu();
    };
  
    const paint = () => {
      if (!isActive) return;
      ctx.fillStyle = "black";
      ctx.font = "9pt sans-serif";
      // if (sampleLoaded) {
      //   let currentSample = sample;
      //   currentSampleState = 0;
  
      //   if (yMovement * machineDirection > config.breaking_point * machineDirection) {
      //     currentSample = sampleCracked;
      //     currentSampleState = 2;
      //   } else if (yMovement * machineDirection > config.yield_point * machineDirection) {
      //     currentSample = sampleNecked;
      //     currentSampleState = 1;
      //   }
  
      //   x = (xOffset + 221) * scale;
  
      //   let yStart = (yOffset + 504 - yMovement * 90) * scale;
      //   let yEnd = (20 + yMovement * 90) * scale;
      //   ctx.drawImage(currentSample, x, yStart, (currentSample.width * scale) / 4, yEnd);
      // }
  
      x = (xOffset + 80) * scale;
      y = (yOffset + 100) * scale;

      ctx.drawImage(imgMIT1, x, y, imgMIT1.width * scale, imgMIT1.height * scale);

      // draw sample
      flashArrow = !flashArrow;
      if (!sampleLoaded && flashArrow) {
        let _y = y + 430 * scale;
        let _x = x + 10 * scale;

        let delX = x + 115;
        ctx.fillText("Drag sample here", _x, _y);
        // ctx.drawImage(arrow, _x + 100, _y, arrow.width / 2, arrow.height / 2);
        ctx.drawImage(arrow, delX, _y - 15, arrow.width / 2, arrow.height / 2);

      }

  
      // x = (xOffset + 295) * scale;
      // y = (yOffset + 180) * scale;
      // ctx.drawImage(imgUTMPiller2, x, y, imgUTMPiller2.width * scale, imgUTMPiller2.height * scale);
  
      // x = (xOffset + 68) * scale;
      // let shift = yMovement * 90 - 125;
      // y = (yOffset - shift) * scale;
      // ctx.drawImage(imgUTM2, x, y, imgUTM2.width * scale, imgUTM2.height * scale);
  
      // (x = xOffset * scale), (y = (yOffset + 500) * scale);
      // ctx.drawImage(imgUTM1, x, y, imgUTM1.width * scale, imgUTM1.height * scale);
  
      if (sampleLoaded) {
        let currentSample = sample1Img;
        if (CURRENT_SAMPLE == "izod") {
          currentSample = sample1Img;
        } else if (CURRENT_SAMPLE == "brass") {
          currentSample = sample2Img;
        } else if (CURRENT_SAMPLE == "steel") {
          currentSample = sample3Img;
        }
        let x = (xOffset + 304) * scale;
        let y = (yOffset + 281) * scale;
        ctx.drawImage(currentSample, x, y, (currentSample.width * scale) / 6, (currentSample.height * scale) / 6);
      }
  
      ctx.save();
    };
  
    const start = (speed, direction) => {
      // speed 0 to 1
      // direction -1:down, 1: up
      machineDirection = direction;
      if (direction == -1) {
        mitPlayRef = setInterval(() => {
          step = speed * 0.05;
          yMovement -= step;
  
          if (yMovement <= config.finish_point) {
            clearInterval(mitPlayRef);
            return;
          }
  
          ctx.refresh();
        }, 100);
      } else {
        mitPlayRef = setInterval(() => {
          step = speed * 0.05;
          yMovement += step;
          currentLoad += 0.5;
          currentDialReading = currentLoad * Math.round(5 * yMovement);
  
          if (yMovement >= config.finish_point) {
            clearInterval(mitPlayRef);
            mitPlayRef = null;
            return;
          }
  
          ctx.refresh();
        }, 100);
      }
    };
  
    const stop = () => {
      if (mitPlayRef) {
        clearInterval(mitPlayRef);
        mitPlayRef = null;
      }
    };
  
    const isInside = ({ x, y }) => {
      boundary = {
        xmin: (xOffset + 185) * scale,
        xmax: (xOffset + 450) * scale,
        ymin: (yOffset + 140) * scale,
        ymax: (yOffset + 550) * scale,
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
        xOffset = (x - 300 * scale) / scale;
        yOffset = (y - 300 * scale) / scale;
  
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
              click: destroy,
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
  
                sampleLoaded = false;
                sample.init();
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
  
    const destroy = () => {
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
      isRunning: () => (mitPlayRef ? true : false),
      loadSample: () => {
        sampleLoaded = true;
        yMovement = 0.4;
      },
      unLoadSample: () => {
        sampleLoaded = false;
        ctx.refresh();
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
      destroy: destroy,
    };
  }
  
  function Sample(canvas, ctx) {
    let assetPath = "images/sample/";
    if (typeof SAMPLE_ASSETS_PATH !== "undefined") {
      assetPath = SAMPLE_ASSETS_PATH;
    }
  
    let itemsToLoad = 3;
    let itemsLoaded = 0;
    let sample1Img = new Image();
    let sample2Img = new Image();
    let sample3Img = new Image();
    // let sample1Cracked = new Image();
    // let sample1Necked = new Image();
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
  
    let scale = 0.6;
  
    let isActive = false;
  
    sample1Img.src = "images/sample/aluminium/1.png";
    sample1Img.onload = itemsLoaded++;
    sample2Img.src = "images/sample/brass/1.png";
    sample2Img.onload = itemsLoaded++;
    sample3Img.src = "images/sample/steel/1.png";
    sample3Img.onload = itemsLoaded++;
    // sample1Necked.src = assetPath + "sample1-necked.png";
    // sample1Necked.onload = itemsLoaded++;
    // sample1Cracked.src = assetPath + "sample1-cracked.png";
    // sample1Cracked.onload = itemsLoaded++;
  
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
  
      let currentSample = sample1Img;
      if (CURRENT_SAMPLE == "aluminium") {
        currentSample = sample1Img;
      } else if (CURRENT_SAMPLE == "brass") {
        currentSample = sample2Img;
      } else if (CURRENT_SAMPLE == "steel") {
        currentSample = sample3Img;
      }
      // if (utm) {
      // if (utm.getSampleState() == 1) {
      //   currentSample = sample1Necked;
      // } else if (utm.getSampleState() == 2) {
      //   currentSample = sample1Cracked;
      // }
      // }
      ctx.drawImage(currentSample, x, y, currentSample.width * scale, currentSample.height * scale);
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
          xmin: (xOffset + 8) * scale,
          xmax: (xOffset + 180) * scale,
          ymin: yOffset * scale,
          ymax: (yOffset + 80) * scale,
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
        if (mit && mit.isActive() && mit.isInside(getMouseCoords(event))) {
          mit.loadSample();
          destroy();
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
          yOffset = (y - 50 * scale) / scale;
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
  
    const destroy = () => {
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
      destroy: destroy,
    };
  }