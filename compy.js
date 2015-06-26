var fileInput = document.getElementById('file-input');
if (fileInput) {
  fileInput.addEventListener('change', function() {
    var file = this.files[0];

    console.log('got file');
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log('read');
      displayLog(event.target.result);
    };

    reader.readAsText(file);
    fileInput.style.display = 'none';
  }, false);
} else {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'log.txt', true);
  xhr.overrideMimeType('text/plain');
  xhr.onload = function() {
    if (xhr.readyState !== 4) {
      return;
    }
    if (xhr.status !== 200) {
      return;
    }
    displayLog(xhr.responseText);
  };
  xhr.send();
}

var timeScale;
var logItemRadius = 40;

function displayLog(file) {
  var parser = new Parser();
  logItems = parser.parse(file);
  logItems = coalesceLogItems(logItems);

  var container = document.createElement('div');
  container.classList.add('container');

  var cursor = new LogItemCursor(logItems);
  for (; cursor; cursor = cursor.next()) {
    container.appendChild(renderCursor(cursor));
  }
  document.body.appendChild(container);
}

function coalesceLogItems(logItems) {
  var coalesced = [logItems[0]];
  function getSecond(logItem) {
    return Math.floor(logItem.date.getTime() / 1000);
  }
  for (var i = 1; i < logItems.length; i++) {
    var lastItem = coalesced[coalesced.length - 1];
    if ((lastItem.tag === logItems[i].tag) &&
        (getSecond(lastItem) === getSecond(logItems[i]))) {
      lastItem.message += '\n' + logItems[i].message;
      continue;
    }
    coalesced.push(logItems[i]);
  }
  return coalesced;
}

function renderCursor(logItemCursor) {
  var prev = logItemCursor.previous();
  var data = logItemCursor.data();
  if (prev) {
    var prevData = prev.data();
    var timeDelta = data.date.getTime() - prevData.date.getTime();
    timeString = formatTimeDelta(timeDelta);
  } else {
    timeString = data.date.toLocaleTimeString();
  }

  var container = document.createElement('div');
  container.classList.add('log-container');
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
  time.textContent = timeString;

  var messageDrawer = new LogDrawer(data);

  logItem.addEventListener('click', messageDrawer.toggle.bind(messageDrawer));

  logItem.appendChild(priority);
  logItem.appendChild(tag);
  logItem.appendChild(time);

  container.appendChild(logItem);
  container.appendChild(messageDrawer.drawer);

  return container;
}

function formatTimeDelta(timeDeltaMs) {
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
}
