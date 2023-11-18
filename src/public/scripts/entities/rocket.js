import gameManager from '../managers/game-manager.js';
import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Rocket extends Entity {
  constructor() {
    super(2);
    this.type = 'Rocket';
    this.width = 4;
    this.height = 4;
  }

  draw(ctx) {
    spriteManager.drawSprite(ctx, 'Rocket' + this.direction, this.x, this.y);
  }

  update() {
    physicsManager.update(this);
  }

  onCollisionEntity(entity) {
    if (entity.type !== 'Rocket') {
      gameManager.deleteEntity(this);
    }
  }

  onCollisionTile() {
    gameManager.deleteEntity(this);
  }
}