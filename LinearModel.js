function LinearModel(getter, setter, velocity) {
  this.get = getter;
  this.set = setter;
  this.setPoint = this.get();
  this.velocity = velocity;
  this.lastUpdate = performance.now();
}

/**
 * Update the model, updating the property it controls if necessary
 */
LinearModel.prototype.update = function() {
  var dTime = performance.now() - this.lastUpdate;
  var dValue = this.get() - this.setPoint;

  if (dValue !== 0) {
    if (Math.abs(dValue) < this.velocity * dTime) {
      this.set(this.setPoint);
    }
    var movement = this.velocity * dTime;
    if (dValue < 0) {
      movement = -movement;
    }
    this.set(this.setPoint + movement);
  }
  this.lastUpdate += dTime;
};

/**
 * Register the LinearModel in the global update loop
 */
LinearModel.prototype.register = function() {
  LinearModel.models.push(this);
};

/** Global registry of active models */
LinearModel.models = [];
/** Update every model */
LinearModel.updateAll = function() {
  for (var i = 0; i < LinearModel.models.length; i++) {
    var model = LinearModel.models[i];
    model.update();
  }
  requestAnimationFrame(LinearModel.updateAll);
};

LinearModel.updateAll();
