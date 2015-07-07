function LogItemView(parent, logItem) {
  this.parent = parent;

  this.container = document.createElement('div');
  this.container.classList.add('log-item-view');

  var listEntry = this.createListEntry(logItem);
  var drawer = this.createDrawer(logItem);
  this.drawerContent = drawer.childNodes[0];

  this.isOpen = false;
  this.drawerHeight = -1;

  this.followingLogItemsContainer = document.createElement('div');
  this.followingLogItemsContainer.classList.add('log-item-container');

  this.container.appendChild(listEntry);
  this.container.appendChild(drawer);
  this.container.appendChild(this.followingLogItemsContainer);
}

/**
 * @return {DOMElement}
 */
LogItemView.prototype.getNextContainer = function() {
  return this.followingLogItemsContainer;
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
 * Get the drawer height, using the cached height if available
 */
LogItemView.prototype.getDrawerHeight = function() {
  if (this.drawerHeight < 0) {
    this.drawerHeight = this.drawerContent.getBoundingClientRect().height;
  }
  return this.drawerHeight;
};

/**
 * Toggle the open state of the drawer
 */
LogItemView.prototype.toggle = function() {
  var newTransform = 'translateY(0px)';


  if (!this.isOpen) {
    newTransform = 'translateY(' + this.getDrawerHeight() + 'px)';
    this.parent.addHeight(this.getDrawerHeight());
  }

  this.followingLogItemsContainer.style.transform = newTransform;
  var reduceHeight = function() {
    this.parent.addHeight(-this.getDrawerHeight());
    this.followingLogItemsContainer.removeEventListener('transform-end',
                                                        reduceHeight, false);
  }.bind(this);

  if (this.isOpen) {
    this.followingLogItemsContainer.addEventListener('transform-end',
                                                     reduceHeight, false);
  }

  this.isOpen = !this.isOpen;
};
