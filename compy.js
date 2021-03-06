var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.addEventListener('change', function() {
  readFile(this.files[0]);
});
document.body.appendChild(fileInput);

if (navigator.mozSetMessageHandler) {
  navigator.mozSetMessageHandler('activity', function(activity) {
    if (activity.source.name === 'open') {
      if (activity.source.blobs) {
        readFile(activity.source.blobs[0]);
      } else if (activity.source.data.blob) {
        readFile(activity.source.data.blob);
      }
    }
  });
}

function readFile(fileBlob) {
  var reader = new FileReader();
  reader.onload = function(event) {
    console.log('read');
    displayLog(event.target.result);
  };

  reader.readAsText(fileBlob);
  fileInput.style.display = 'none';
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
