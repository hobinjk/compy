function Parser() {
}

/**
 * Perform parsing of a given log
 * @param {String} logString
 * @return {Array<LogItem>}
 */
Parser.prototype.parse = function(logString) {
  this.input = logString;
  this.index = 0;
  this.knownThreadIdTags = {};
  var items = [];

  while (this.canPeek(1)) {
    items.push(this.parseItem());
  }
  return items;
};

/**
 * @param {number} len
 * @return {boolean} If there are at least len characters
 * left in the input
 */
Parser.prototype.canPeek = function(len) {
  return this.index + len < this.input.length;
};

/**
 * @param {number} len
 * @return {String} The next len characters
 */
Parser.prototype.peek = function(len) {
  if (!this.canPeek(len)) {
    throw new Error('Out of data');
  }
  return this.input.substr(this.index, len);
};

/**
 * Consumes and returns len characters from input
 * @param {number} len
 * @return {String}
 */
Parser.prototype.take = function(len) {
  var str = this.peek(len);
  this.index += len;
  return str;
};

/**
 * Attempts to take len characters and parse as integer
 * @param {number} len
 * @return {number}
 */
Parser.prototype.takeInt = function(len) {
  var str = this.take(len);
  return parseInt(str);
};

/**
 * Takes from input until chr is encountered (non-inclusive)
 * @param {String} chr
 * @return {String}
 */
Parser.prototype.takeUntil = function(chr) {
  var idx = this.input.indexOf(chr, this.index);
  if (idx < 0) {
    throw new Error('"' + chr + '" not found');
  }
  var str = this.input.substring(this.index, idx);
  this.index = idx;
  return str;
};

/**
 * Parse a single item in the log
 * @return {LogItem}
 */
Parser.prototype.parseItem = function() {
  // Format will be MM-DD HH:MM:SS.mmm PidPid TidTid P tag: message
  var year = new Date().getFullYear();

  var month = this.takeInt(2);
  this.take(1);

  var day = this.takeInt(2);
  this.take(1);

  var hours = this.takeInt(2);
  this.take(1);

  var minutes = this.takeInt(2);
  this.take(1);

  var seconds = this.takeInt(2);
  this.take(1);

  var milliseconds = this.takeInt(3);
  this.take(1);

  var pid = this.takeInt(5);
  this.take(1);

  var tid = this.takeInt(5);
  this.take(1);

  var priority = this.take(1);
  var tag = this.takeUntil(':').trimLeft();
  if (tag.length === 0) {
    tag = this.knownThreadIdTags[tid] || tid.toString();
  } else {
    this.knownThreadIdTags[tid] = tag;
  }

  this.take(1);
  var message = this.takeUntil('\n');

  if (this.canPeek(1)) {
    this.take(1);

    while (!(/\d\d-\d\d \d\d:\d\d:\d\d\.\d\d\d/)
            .test(this.peek('MM-DD HH:MM:SS.mmm'.length))) {
      message += '\n' + this.takeUntil('\n');
      this.take(1);
      break;
    }
  }

  return {
    date: new Date(year, month, day, hours, minutes, seconds, milliseconds),
    pid: pid,
    tid: tid,
    priority: priority,
    tag: tag,
    message: message
  };
};
