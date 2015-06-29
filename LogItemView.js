function LogItemView(parent, logItem, index, baseY) {
  this.parent = parent;
  this.index = index;

  this.container = document.createElement('div');
  this.container.classList.add('log-container');

  this.listEntry = this.createListEntry(logItem);
  this.drawer = this.createDrawer(logItem);

  this.container.appendChild(this.listEntry);
  this.container.appendChild(this.drawer);

  this.isOpen = false;

  this.setY(baseY);
  this.physicsModel = new LinearModel(this.getY.bind(this),
                                      this.setY.bind(this), 0.01);
  this.physicsModel.register();
}

/**
 * @return {number}
 */
LogItemView.prototype.getY = function() {
  return this.y;
};

/**
 * @param {number} y
 */
LogItemView.prototype.setTargetY = function(y) {
  this.physicsModel.setPoint = y;
};

/**
 * @return {number}
 */
LogItemView.prototype.getTargetY = function() {
  return this.physicsModel.setPoint;
};

/**
 * @param {number} y
 */
LogItemView.prototype.setY = function(y) {
  this.y = y;
  this.container.style.transform = 'translateY(' + this.y + 'px)';
};

/**
 * Create the always-visible list entry
 * @param {LogItem} data
 * @return {DOMElement}
 */
LogItemView.prototype.createListEntry = function(data) {
  var logItem = document.createElement('div');
  logItem.classList.add('log-item');
  var priority = document.createElement('span');
  priority.classList.add('log-item-priority');
  priority.classList.add('log-item-priority-' + data.priority.toLowerCase());
  priority.textContent = data.priority;

  var tag = document.createElement('span');
  tag.classList.add('log-item-tag');
  tag.textContent = data.tag;

  var time = document.createElement('span');
  time.classList.add('log-item-time');
  time.textContent = data.timeString;

  logItem.addEventListener('click', this.toggle.bind(this));
  logItem.appendChild(priority);
  logItem.appendChild(tag);
  logItem.appendChild(time);

  return logItem;
};

/**
 * Create the log message drawer
 * @param {LogItem} data
 * @return {DOMElement}
 */
LogItemView.prototype.createDrawer = function(data) {
  var drawer = document.createElement('div');
  drawer.classList.add('log-drawer');

  content = document.createElement('pre');
  content.classList.add('log-drawer-content');
  content.textContent = data.message;

  drawer.appendChild(content);

  return drawer;
};

/**
 * Toggle the open state of the drawer
 */
LogItemView.prototype.toggle = function() {
  console.log('Opening');
  if (this.isOpen) {
    this.parent.close(this.index);
  } else {
    this.parent.open(this.index);
  }
  this.isOpen = !this.isOpen;
};
