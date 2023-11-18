import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';
import { Rocket } from './rocket.js';

export class Tank extends Entity {
  constructor(isEnemy = true) {
    super(1);
    this.isEnemy = isEnemy;
    this.width = 32;
    this.height = 32;
  }


  draw(ctx) {
    if (this.isEnemy) {
      spriteManager.drawSprite(ctx, 'EnemyLeft', this.x, this.y);
    } else {
      spriteManager.drawSprite(ctx, 'PlayerLeft', this.x, this.y);
    }
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

  fire() {
    const rocket = new Rocket();
    rocket.x = this.x + this.width / 2 - rocket.width / 2;
    rocket.y = this.y + this.height / 2 - rocket.height / 2;
    rocket.moveX = this.moveX;
    rocket.moveY = this.moveY;
    return rocket;
  }
}