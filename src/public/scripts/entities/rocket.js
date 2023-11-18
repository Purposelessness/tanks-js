import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Rocket extends Entity {
  constructor() {
    super(4);
  }

  draw(ctx) {
    spriteManager.drawSprite(ctx, 'RocketTop', this.x, this.y);
  }

  update() {
    physicsManager.update(this);
  }

  onCollisionEntity(entity) {
    console.log('Player collided with entity:', entity);
  }

  onCollisionTile(tile) {
    console.log('Player collided with tile:', tile);
  }
}