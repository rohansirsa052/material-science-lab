const popoverStyle = `
.popover {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 15px 1px rgb(0 0 0 / 35%);
  padding: 10px;
  padding-top: 20px;
  min-width: 100px;
  max-width: 280px;
  position: absolute;
}
.popover .arrow {
  position: absolute;
  width: 0;
  height: 0;
  margin-left: -20px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid rgb(255, 255, 255);
}
.popover-buttons {
  text-align: end;
}
.popover-buttons button {
  border: none;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  color: blue;
  font-weight: 600;
}
.popover-buttons button:hover {
  background-color: rgb(0, 0, 255, 0.05);
}
`;

class Popover {
  constructor() {
    this.body = "";
    this.isVisible = false;
    this.position = { x: 0, y: 0 };
    this.callback = () => {};
  }

  setBody(body) {
    this.body = body;
  }

  setPosition(position) {
    let style = "";
    for (const [key, value] of Object.entries(position)) {
      style += `${key}: ${value};`;
    }
    this.position = style;
  }

  show() {
    this.isVisible = true;
    this.render();
  }

  onNext(callback) {
    this.callback = callback;
  }

  destroy() {
    this.isVisible = false;
    document.getElementById(this.id).remove();
  }

  render() {
    if (this.isVisible) {
      this.id = "popover_" + Math.random().toString(36).substring(7);
      let html = `
        <div id="${this.id}">
          <style>${popoverStyle}</style>
          <div class="popover" style="${this.position}">
              <div class="arrow left"></div>
              <div class="body">${this.body}</div>
              <div class="popover-buttons">
                <button class="btn btn-primary">Next</button>
              </div>
            </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", html);

      document.getElementById(this.id).querySelector(".popover-buttons button").addEventListener("click", this.callback);
    }
  }
}
