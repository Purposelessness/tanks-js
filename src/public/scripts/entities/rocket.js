import gameManager from '../managers/game-manager.js';
import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Rocket extends Entity {
  constructor(isEnemy = false) {
    super(2);
    this.type = 'Rocket';
    this.width = 4;
    this.height = 4;
    this.isEnemy = isEnemy;
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
      if (!(this.isEnemy && entity.isEnemy)) {
        gameManager.deleteEntity(entity);
      }
    }
    return true;
  }

  onCollisionTile() {
    gameManager.deleteEntity(this);
  }
}