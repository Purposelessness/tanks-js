import gameManager from '../managers/game-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class HealthUp extends Entity {
  constructor() {
    super(0);
    this.type = 'HealthUp';
  }

  draw(ctx) {
    spriteManager.drawSprite(ctx, 'HealthUp', this.x, this.y);
  }
}