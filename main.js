var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();        // int
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}
Animation.prototype.drawFrame2 = function (tick, ctx, x, y, imageRow) {
    this.elapsedTime += tick;
    if (this.isDone()) {
      if (this.loop) this.elpastedTime = 0;
    }
    var frame = this.currentFrame();
    var xIndex = frame % this.sheetWidth;
    ctx.drawImage(this.spriteSheet,
                  xIndex * this.frameWidth, imageRow * this.frameHeight,
                  this.frameWidth, this.frameHeight,
                  x, y,
                  this.frameWidth * this.scale,
                  this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, 0, 0, 852, 480, 0, 0, 852, 480);
};

Background.prototype.update = function () {
};

function Planet(game, spritesheet, x, y, v, angle, mass) {
    this.animation = new Animation(spritesheet, 300, 300, 300, 1, 1, true, 0.1);
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);
    this.m = mass;
    this.ax = 0;
    this.ay = 0;
    this.ctx = game.ctx;
    /*
    this.degree = 0;
    this.speed = 20;
    this.offset = 300;
    this.ctx = game.ctx;
    this.radius = (this.ctx.canvas.width - this.offset) / 2;
    this.cx = this.ctx.canvas.width / 2;
    this.cy = this.ctx.canvas.height / 2;
    */
    Entity.call(this, game, x, y);
}
Planet.prototype = new Entity();
Planet.prototype.constructor = Planet;
Planet.prototype.update = function () {
    this.vx += this.ax * this.game.clockTick;
    this.vy += this.ay * this.game.clockTick;

    this.x += this.vx * this.game.clockTick;
    this.y += this.vy * this.game.clockTick;

    this.ax = 0;
    this.ay = 0;
    /*
    this.degree += this.game.clockTick * this.speed;
    var a = this.degree * (Math.PI / 180);
    this.x = this.cx + this.radius * Math.cos(a);
    this.y = this.cy + this.radius * Math.sin(a);
    */
    //console.log(`${this.x}, ${this.y}`);
    Entity.prototype.update.call(this);
}
Planet.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
function Sun(game, spritesheet, x, y, v, angle, mass) {
    this.animation = new Animation(spritesheet, 50, 50, 150, 0.1, 3, true, 1);
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);
    this.m = mass;
    this.ax = 0;
    this.ay = 0;
    this.ctx = game.ctx;
    /*
    this.speed = 20;
    this.ctx = game.ctx;
    */
    Entity.call(this, game, x, y);
}
Sun.prototype = new Entity();
Sun.prototype.constructor = Sun;
Sun.prototype.update = function () {
    this.vx += this.ax * this.game.clockTick;
    this.vy += this.ay * this.game.clockTick;

    this.x += this.vx * this.game.clockTick;
    this.y += this.vy * this.game.clockTick;

    this.ax = 0;
    this.ay = 0;
    Entity.prototype.update.call(this);
}
Sun.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function DancingAlien(game, spritesheet) {
  this.animation = new Animation(spritesheet, 110, 128, 8, 0.1, 8, true, 1)
  this.ctx = game.ctx;
  this.speed = 180;
  this.imageRow = 0;
  this.direction = 1;
  Entity.call(this, game, 400, 350);
}
DancingAlien.prototype = new Entity();
DancingAlien.prototype.constructor = DancingAlien;
DancingAlien.prototype.update = function () {
  console.log("alien update");
  if (this.game.inputs["Digit1"]) {
    this.imageRow = 1;
  }
  if (this.game.inputs["Digit2"]) {
    this.imageRow = 2;
  }
  if (this.game.inputs["Digit3"]) {
    this.imageRow = 3;
  }
  if (this.game.inputs["Digit4"]) {
    this.imageRow = 4;
  }
  if (this.game.inputs["Digit5"]) {
    this.imageRow = 5;
  }
  if (this.game.inputs["Digit6"]) {
    this.imageRow = 6;
  }
  if (this.game.inputs["Digit7"]) {
    this.imageRow = 7;
  }
  if (this.game.inputs["Digit8"]) {
    this.imageRow = 8;
  }
  if (this.game.inputs["Digit9"]) {
    this.imageRow = 9;
  }
  if (this.direction === 1) {
    this.x += this.game.clockTick * this.speed;
  }
  if (this.direction === -1) {
    this.x -= this.game.clockTick * this.speed;
  }
  if (this.x > 600 || this.x < 80) {
    this.direction = this.direction * -1;
  }
  Entity.prototype.update.call(this);
}

DancingAlien.prototype.draw = function () {
  console.log(`alien drawn (${this.x}, ${this.y})`);
  this.animation.drawFrame2(this.game.clockTick, this.ctx, this.x, this.y, this.imageRow);
  Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/planet1.png");
AM.queueDownload("./img/planet2.png");
AM.queueDownload("./img/planet3.png");
AM.queueDownload("./img/planet4.png");
AM.queueDownload("./img/planet5.png");
AM.queueDownload("./img/planet6.png");
AM.queueDownload("./img/sun.png");
AM.queueDownload("./img/space.jpg");
AM.queueDownload("./img/alien_dancing.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
                                                                        //   x,   y,   v, angle, mass
    var planet1 = new Planet(gameEngine, AM.getAsset("./img/planet1.png"), 120, 300, 200, Math.PI/2, 2);
    var planet2 = new Planet(gameEngine, AM.getAsset("./img/planet2.png"), 140, 300, 200, Math.PI/2, 2);
    var planet3 = new Planet(gameEngine, AM.getAsset("./img/planet3.png"), 160, 250, 150, Math.PI/2, 50);
    var planet4 = new Planet(gameEngine, AM.getAsset("./img/planet4.png"), 180, 250, 150, Math.PI/2, 50);
    var planet5 = new Planet(gameEngine, AM.getAsset("./img/planet5.png"), 200, 200, 200, Math.PI/2, 20);
    var planet6 = new Planet(gameEngine, AM.getAsset("./img/planet6.png"), 220, 200, 200, Math.PI/2, 20);
    var sun = new Sun(gameEngine, AM.getAsset("./img/sun.png"), canvas.width/2, canvas.height/2, 0, 0, 900000);

    gameEngine.addBackground(new Background(gameEngine, AM.getAsset("./img/space.jpg")));
    gameEngine.addAlien(new DancingAlien(gameEngine, AM.getAsset("./img/alien_dancing.png")));
    gameEngine.addPlanet(planet1);
    gameEngine.addPlanet(planet2);
    gameEngine.addPlanet(planet3);
    gameEngine.addPlanet(planet4);
    gameEngine.addPlanet(planet5);
    gameEngine.addPlanet(planet6);
    gameEngine.addPlanet(sun);
    gameEngine.startKeyboardInput();

    console.log("All Done!");
});
