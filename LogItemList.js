function LogItemList(logItems) {
  this.container = document.createElement('div');
  this.container.classList.add('log-item-view');

  var cursor = new LogItemCursor(logItems);

  this.views = [];
  for (; cursor; cursor = cursor.next()) {
    this.addTimeDelta(cursor);
    var logItemView = new LogItemView(this, cursor.data());
    this.views.push(logItemView);
  }

  var lastContainer = this.container;
  this.views.forEach(function(view) {
    lastContainer.appendChild(view.container);
    lastContainer = view.getNextContainer();
  });

  lastContainer.style.background = 'white';
  this.overflowContainer = lastContainer;
}

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
 * Add height to the overflow container
 * Required to be hackily performant
 * @param {number} height
 */
LogItemList.prototype.addHeight = function(height) {
  var originalHeight = this.overflowContainer.getBoundingClientRect().height;
  this.overflowContainer.style.height = (originalHeight + height) + 'px';
};
