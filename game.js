function Game(canvas) {
  var self = this

  this.context = canvas.getContext("2d")
  this.width = canvas.width
  this.height = canvas.height


  this.keyPressed = {}

  $(canvas).on('keydown keyup', function(e) {
    var keyName = Game.keys[e.which]

    if (keyName) {
      self.keyPressed[keyName] = e.type === 'keydown'
      e.preventDefault()
    }
  })
}

Game.keys = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

Game.prototype.update = function() {
  this.entities.forEach(function(entity) {
    if (entity.update) entity.update()
  })
}

Game.prototype.draw = function() {
  var self = this

  this.entities.forEach(function(entity) {
    if (entity.draw) entity.draw(self.context)
  })
}



Game.prototype.start = function() {
  var self = this

  this.lastUpdateTime = new Date().getTime()
  
  // The loop
  onFrame(function() {
    // A turn in the loop is called a step.
    // Two possible modes:
    self.fixedTimeStep()
    // or
    // self.variableTimeStep()
  })
}

// Instead of relying on a timer, we use a special browser function called
// `requestAnimationFrame(callback)`. It calls the `callback` at interval 
// synced with the display refresh rate.
// More info at:
// https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame
var onFrame = function(callback) {
  if (window.requestAnimationFrame) {
    requestAnimationFrame(function() {
      callback()
      // requestAnimationFrame only calls our callback once, we need to
      // schedule the next call ourself.
      onFrame(callback)
    })
  } else {
    // requestAnimationFrame is not supported by all browsers. We fall back to
    // a timer.
    var fps = 60
    setInterval(callback, 1000 / fps)
  }
}

// With fixed time steps, each update is done at a fixed interval.
Game.prototype.fixedTimeStep = function() {
  var fps = 60,
      interval = 1000 / fps,
      updated = false

  // While we're not up to date ...
  while (this.lastUpdateTime < new Date().getTime()) {
    this.update()
    updated = true
    // We jump at fixed intervals until we catch up to the current time.
    this.lastUpdateTime += interval
  }

  // No need to draw if nothing was updated
  if (updated) this.draw()
  updated = false
}

// With a variable time steps, update are done whenever we need to draw.
// However we do partial updates. Only updating a percentage of what a fixed
// time step would normally do.
Game.prototype.variableTimeStep = function() {
  var currentTime = new Date().getTime(),
      fps = 60,
      interval = 1000 / fps,
      timeDelta = currentTime - this.lastUpdateTime,
      percentageOfInterval = timeDelta / interval

  
  this.update(percentageOfInterval)
  this.draw()

  this.lastUpdateTime = new Date().getTime()
}

;// 
// hi