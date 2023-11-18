import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Rocket extends Entity {
  constructor(speed) {
    super(speed);
  }

  draw(ctx) {
    spriteManager.drawSprite(ctx, 'RocketTop', this.x, this.y);
  }
}