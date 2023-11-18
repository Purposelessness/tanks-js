import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';
import { Rocket } from './rocket.js';

export class Tank extends Entity {
  spriteName = 'EnemyLeft';

  constructor(isEnemy = true) {
    super(1);
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
  }

  goDown() {
    this.moveY = 1;
    this.moveX = 0;
    this.spriteName = this.isEnemy ? 'EnemyDown' : 'PlayerDown';
  }

  goLeft() {
    this.moveY = 0;
    this.moveX = -1;
    if (this.isEnemy) {
      this.spriteName = 'EnemyLeft';
    } else {
      this.spriteName = 'PlayerLeft';
    }
  }

  goRight() {
    this.moveY = 0;
    this.moveX = 1;
    if (this.isEnemy) {
      this.spriteName = 'EnemyRight';
    } else {
      this.spriteName = 'PlayerRight';
    }
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
    rocket.x = this.x + this.width / 2 - rocket.width / 2;
    rocket.y = this.y + this.height / 2 - rocket.height / 2;
    rocket.moveX = this.moveX;
    rocket.moveY = this.moveY;
    return rocket;
  }
}