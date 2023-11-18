import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Rocket extends Entity {
  constructor() {
    super(4);
    this.width = 4;
    this.height = 4;
    this.moveX = 1;
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

  onCollisionTile() {
    console.log('Player collided with tile');
  }
}