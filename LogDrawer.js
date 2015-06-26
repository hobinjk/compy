function LogDrawer(logItem) {
  this.drawer = document.createElement('div');
  this.drawer.classList.add('log-drawer');

  this.content = document.createElement('pre');
  this.content.classList.add('log-drawer-content');
  this.content.textContent = logItem.message;

  this.drawer.appendChild(this.content);
  this.isOpen = false;
}

LogDrawer.prototype.getHeight = function(element) {
  return element.getBoundingClientRect().height;
};

LogDrawer.prototype.toggle = function() {
  if (this.isOpen) {
    this.close();
  } else {
    this.open();
  }
  this.isOpen = !this.isOpen;
};

LogDrawer.prototype.open = function() {
  var contentHeight = this.getHeight(this.content);
  this.drawer.classList.add('log-drawer-open');
  this.drawer.style.maxHeight = contentHeight + 'px';
};

LogDrawer.prototype.close = function() {
  this.drawer.classList.remove('log-drawer-open');
  this.drawer.style.maxHeight = '0px';
};
