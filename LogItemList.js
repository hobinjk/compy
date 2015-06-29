function LogItemList(logItems) {
  this.container = document.createElement('div');
  this.container.classList.add('container');

  var cursor = new LogItemCursor(logItems);
  var logItemHeight = this.precalculateHeight(cursor);

  this.views = [];
  var y = 0;
  var index = 0;
  for (; cursor; cursor = cursor.next()) {
    this.addTimeDelta(cursor);
    var logItemView = new LogItemView(this, cursor.data(),
                                      index, index * logItemHeight);
    index++;
    this.views.push(logItemView);
  }

  this.views.forEach(function(view) {
    this.container.appendChild(view.container);
  }.bind(this));
}

/**
 * Assumes that logItemView's height is in rem
 * @param {LogItemCursor} cursor
 * @return {number}
 */
LogItemList.prototype.precalculateHeight = function(cursor) {
  var logItemView = new LogItemView(this, cursor.data(), 0, 0);
  document.body.appendChild(logItemView.listEntry);
  var height = logItemView.listEntry.getBoundingClientRect().height;
  document.body.removeChild(logItemView.listEntry);
  return height;
};

/**
 * @param {LogItemCursor} logItemCursor
 */
LogItemList.prototype.addTimeDelta = function(logItemCursor) {
  var prev = logItemCursor.previous();
  var data = logItemCursor.data();
  if (prev) {
    var prevData = prev.data();
    var timeDelta = data.date.getTime() - prevData.date.getTime();
    data.timeString = this.formatTimeDelta(timeDelta);
  } else {
    data.timeString = data.date.toLocaleTimeString();
  }
};

/**
 * Format a time difference
 * @param {number} timeDeltaMs - Time difference in milliseconds
 * @return {String}
 */
LogItemList.prototype.formatTimeDelta = function(timeDeltaMs) {
  if (timeDeltaMs < 1000) {
    return '+' + timeDeltaMs + 'ms';
  }
  var timeDeltaS = Math.floor(timeDeltaMs / 1000);
  if (timeDeltaS < 60) {
    return '+' + timeDeltaS + 's';
  }
  var timeDeltaM = Math.floor(timeDeltaS / 60);
  if (timeDeltaM < 60) {
    return '+' + timeDeltaM + 'm';
  }
  return '+' + Math.floor(timeDeltaM / 60) + 'h';
};

/**
 * Open a specific log item
 * @param {number} index
 */
LogItemList.prototype.open = function(index) {
  console.log('Opening ' + index);
  var openingView = this.views[index];
  var height = openingView.drawer.childNodes[0].getBoundingClientRect().height;
  for (var i = index + 1; i < this.views.length; i++) {
    var view = this.views[i];
    view.setTargetY(view.getTargetY() + height);
  }
};

/**
 * Close a specific log item
 * @param {number} index
 */
LogItemList.prototype.close = function(index) {
  var openingView = this.views[index];
  var height = openingView.drawer.getBoundingClientRect().height;
  for (var i = index + 1; i < this.views.length; i++) {
    var view = this.views[i];
    view.setTargetY(view.getTargetY() - height);
  }
};
