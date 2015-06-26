function LogItemCursor(logItems, index) {
  this.index = index || 0;
  this.logItems = logItems;
}

LogItemCursor.prototype.data = function() {
  return this.logItems[this.index];
};

LogItemCursor.prototype.previous = function() {
  if (this.index > 0) {
    return new LogItemCursor(logItems, this.index - 1);
  }
  return null;
};

LogItemCursor.prototype.next = function() {
  if (this.index < this.logItems.length - 1) {
    return new LogItemCursor(logItems, this.index + 1);
  }
  return null;
};
