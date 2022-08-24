class ContextMenu {
  static deleteIcon = `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" style="margin-right: 7px" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

  static pinIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABGklEQVRIie3UP0oDYRCG8Z+InXZmIb02VhZi5wGs7L2AJBewEJtU1t7AA+gJ7DxBNGAnaGOjRMFChLgWmWU/lmhikq30rXZnZp+X+cPyl9VCVhe8jRw3dZlkuKvLZAGHGIRBjls05wFfxnlAB+gEfC6drAUkxyv2Ip6hZ4pO0ivZRT8gPaxXao+U45qok/RKOsp5X2ClUruDD3ziPura4wwy5TiKeR8bLjhVE49RcxLftcbBR5m8YLOSX8JV5C+xOCk4VQPXAeljK8mdRvwh6qbWhnIHT4ad7Mf7O7Znga+iq9xDjme8xfPBvOBdw07SxZ/NAm9U4KtJvNjJ1L+H7+CF0usae++/hacmE997qqL9n+AzqVb4v0bqC6AyX4ICuG4RAAAAAElFTkSuQmCC" width="18">&nbsp;`;

  static unpinIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABTklEQVRIib3UzSpFURTA8Z+PmYi6MymPIFcpZeAFDHgLKYUhZSYDSneECQMDUyMKAyPvQJGxDBUJg7Nv7a7j3L1vWHXa56zWWv/1sc/iH6WGrkyfZPsa7tHIcBrGDUZSM9nFJ/YSIN24CPYPGE2FNIJTu0rWgt0WnnHnFyuZxBtOwvcYnmRW8hNkUDGrOwxE+o4gzXYdYAGrOMMrJkp86jLb1RtB4me5wmcr2Nxoc1HWcYm+CHKI8R8cB3Ac7K4UV7hS5hSDvEa/6sHXcYt3bKCnXfBUSBeWFDN5xHRq4DJIa7saIfNPnGOok+BNmcdHCeQonCtVzr0JgClFO2ZwitmgXwznS3bKkWwrstxWVFLWrn35WxhshgA7kS7ndiVn3irx4OOfMXnVVwWPIevhPWcLJwUvk2RIa89zIR3PJAfSUKz02l8AmpA/C/5NvgBs/2yGA40i7wAAAABJRU5ErkJggg==" width="18">&nbsp;`;

  constructor(params) {
    if (params) {
      let { menuItems = [], mode = "light" } = params;
      this.menuItems = menuItems;
      this.mode = mode;
      this.menuItemsNode = this.getMenuItemsNode();
    }
    else{
      this.mode = "light";
    }
    this.isOpened = false;
  }

  getMenuItemsNode() {
    const nodes = [];

    if (!this.menuItems) {
      console.error("getMenuItemsNode :: Please enter menu items");
      return [];
    }

    this.menuItems.forEach((data, index) => {
      const item = this.createItemMarkup(data);
      item.firstChild.setAttribute("style", `animation-delay: ${index * 0.08}s`);
      nodes.push(item);
    });

    return nodes;
  }

  createItemMarkup(data) {
    const button = document.createElement("BUTTON");
    const item = document.createElement("LI");

    button.innerHTML = data.content;
    button.classList.add("contextMenu-button");
    item.classList.add("contextMenu-item");

    if (data.divider) item.setAttribute("data-divider", data.divider);
    item.appendChild(button);

    if (data.events && data.events.length !== 0) {
      Object.entries(data.events).forEach((event) => {
        const [key, value] = event;
        button.addEventListener(key, value);
      });
    }

    return item;
  }

  renderMenu() {
    const menuContainer = document.createElement("UL");

    menuContainer.classList.add("contextMenu");
    menuContainer.setAttribute("data-theme", this.mode);

    this.menuItemsNode.forEach((item) => menuContainer.appendChild(item));

    return menuContainer;
  }

  setMenuItems(menuItems) {
    this.menuItems = menuItems;
    this.menuItemsNode = this.getMenuItemsNode();
  }

  closeMenu(menu) {
    if (this.isOpened) {
      this.isOpened = false;
      menu.remove();
    }
  }

  show(e) {
    const contextMenu = this.renderMenu();
    this.isOpened = true;

    const { clientX, clientY } = e;
    document.body.appendChild(contextMenu);

    const positionY =
      clientY + contextMenu.scrollHeight >= window.innerHeight
        ? window.innerHeight - contextMenu.scrollHeight - 20
        : clientY;
    const positionX =
      clientX + contextMenu.scrollWidth >= window.innerWidth
        ? window.innerWidth - contextMenu.scrollWidth - 20
        : clientX;

    contextMenu.setAttribute(
      "style",
      `width: ${contextMenu.scrollWidth}px;
          height: ${contextMenu.scrollHeight}px;
          top: ${positionY}px;
          left: ${positionX}px;`
    );
    return contextMenu;
  }
}
