import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';
import { Rocket } from './rocket.js';

export class Tank extends Entity {
  spriteName = 'EnemyLeft';
  direction = 'left';

  constructor(isEnemy = true) {
    super(1);
    this.type = 'Tank';
    this.isEnemy = isEnemy;
    this.width = 32;
    this.height = 32;

    if (!isEnemy) {
      this.spriteName = 'PlayerLeft';
    }
  }

  goUp() {
    this.moveY = -1;
    this.moveX = 0;
    this.spriteName = this.isEnemy ? 'EnemyTop' : 'PlayerTop';
    this.direction = 'up';
  }

  goDown() {
    this.moveY = 1;
    this.moveX = 0;
    this.spriteName = this.isEnemy ? 'EnemyDown' : 'PlayerDown';
    this.direction = 'down';
  }

  goLeft() {
    this.moveY = 0;
    this.moveX = -1;
    this.spriteName = this.isEnemy ? 'EnemyLeft' : 'PlayerLeft';
    this.direction = 'left';
  }

  goRight() {
    this.moveY = 0;
    this.moveX = 1;
    this.spriteName = this.isEnemy ? 'EnemyRight' : 'PlayerRight';
    this.direction = 'right';
  }

  draw(ctx) {
    spriteManager.drawSprite(ctx, this.spriteName, this.x, this.y);
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

  fire() {
    const rocket = new Rocket();

    switch (this.direction) {
      case 'up':
        rocket.x = this.x;
        rocket.y = this.y - 22;
        rocket.moveY = -1;
        break;
      case 'down':
        rocket.x = this.x;
        rocket.y = this.y + 22;
        rocket.moveY = 1;
        break;
      case 'left':
        rocket.x = this.x - 22;
        rocket.y = this.y;
        rocket.moveX = -1;
        break;
      case 'right':
        rocket.x = this.x + 22;
        rocket.y = this.y;
        rocket.moveX = 1;
        break;
    }

    return rocket;
  }
}