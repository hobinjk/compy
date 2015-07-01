if (navigator.mozSetMessageHandler) {
  navigator.mozSetMessageHandler('activity', function(activity) {
    if (activity.source.name === 'open') {
      var reader = new FileReader();
      reader.onload = function(event) {
        console.log('read');
        displayLog(event.target.result);
      };

      reader.readAsText(activity.source.filename);
    }
  });
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
