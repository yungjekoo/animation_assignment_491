window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.planets = [];
    this.inputs = {
			"Digit1": false,
			"Digit2": false,
			"Digit3": false,
			"Digit4": false,
			"Digit5": false,
			"Digit6": false,
			"Digit7": false,
      "Digit8": false,
      "Digit9": false,
			"Digit0": false
		};
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.background = [];
    this.aliens = []
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addPlanet = function (planet) {
    console.log('added planet');
    this.planets.push(planet);
}

GameEngine.prototype.addAlien = function (alien) {
    console.log('added alien');
    this.aliens.push(alien);
}

GameEngine.prototype.addBackground = function (background) {
    console.log('added misc');
    this.background.push(background)
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();

    for (var j = 0; j < this.background.length; j++) {
      this.background[j].draw();
    }

    for (var k = 0 ; k < this.aliens.length; k++) {
      this.aliens[k].draw();
    }

    for (var i = 0; i < this.planets.length; i++) {
        this.planets[i].draw();
    }
    this.ctx.restore();
}

GameEngine.prototype.startKeyboardInput = function () {
  var self = this;

  // If button is pressed and the button is a key we care about, set it to true.
  this.ctx.canvas.addEventListener("keydown", (key) =>
  {
    if (Object.prototype.hasOwnProperty.call(self.inputs, key.code))
    {
      self.inputs[key.code] = true;
      console.log("input");
    }
  });

  // If button is lifted from press and the button is a key we care about, set it to false.
  this.ctx.canvas.addEventListener("keyup", (key) =>
  {
    if (Object.prototype.hasOwnProperty.call(self.inputs, key.code))
    {
      self.inputs[key.code] = false;
    }
  });
  console.log("input ready");
}

GameEngine.prototype.update = function () {

    for (var j = 0; j < this.background.length; j++) {
      var background = this.background[j];
      background.update();
    }

    for (var k = 0; k < this.aliens.length; k++) {
      var alien = this.aliens[k];
      alien.update();
    }

    for (var i = 0; i < this.planets.length; i++) {
      var planet = this.planets[i];
      planet.update();
    }
}

GameEngine.prototype.updateSystem = function() {
    var entitiesCount = this.planets.length;

    var G = 9;

    for (var i = 0; i < entitiesCount; i++) {
      for (var j = 0; j < entitiesCount; j++) {
        if (i == j) continue;
        var b1 = this.planets[i];     // body 1
        var b2 = this.planets[j];     // body 2

        var dist = Math.sqrt(                     // distance between body 1 and body 2
          (b1.x - b2.x) * (b1.x - b2.x) +
          (b1.y - b2.y) * (b1.y - b2.y)
        );

        var force = G * (b1.m * b2.m) / dist / dist;    // gravitational force acting on body 1 and body 2 (???)

        var nx = (b2.x - b1.x) / dist;
        var ny = (b2.y - b1.y) / dist;

        b1.ax += nx * force / b1.m;
        b1.ay += ny * force / b1.m;

        b2.ax -= nx * force / b2.m;
        b2.ay -= ny * force / b2.m;
      }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.updateSystem();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
