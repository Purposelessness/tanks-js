import gameManager from '../managers/game-manager.js';

export class Entity {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  moveX = 0;
  moveY = 0;
  speed = 0;

  constructor(speed) {
    this.speed = speed;
    this.id = gameManager.getUniqueId();
    this.type = null;
  }
}