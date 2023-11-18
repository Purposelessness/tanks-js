import gameManager from '../managers/game-manager.js';

export class Entity {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  moveX = 0;
  moveY = 0;
  speed = 0;

  direction = 'Left';

  constructor(speed) {
    this.speed = speed;
    this.id = gameManager.getUniqueId();
    this.type = null;
  }

  goUp() {
    this.moveY = -1;
    this.moveX = 0;
    this.direction = 'Up';
  }

  goDown() {
    this.moveY = 1;
    this.moveX = 0;
    this.direction = 'Down';
  }

  goLeft() {
    this.moveY = 0;
    this.moveX = -1;
    this.direction = 'Left';
  }

  goRight() {
    this.moveY = 0;
    this.moveX = 1;
    this.direction = 'Right';
  }
}