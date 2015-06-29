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
  /** Display log after loading text */
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

function displayLog(file) {
  var parser = new Parser();
  logItems = parser.parse(file);
  logItems = coalesceLogItems(logItems);
  var listView = new LogItemList(logItems);
  document.body.appendChild(listView.container);
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
