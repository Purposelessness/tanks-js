import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';

export class Tank extends Entity {
  constructor(isEnemy = true) {
    super(1);
    this.isEnemy = isEnemy;
  }


  draw(ctx) {
    if (this.isEnemy) {
      spriteManager.drawSprite(ctx, 'EnemyLeft', this.x, this.y);
    } else {
      spriteManager.drawSprite(ctx, 'PlayerLeft', this.x, this.y);
    }
  }

  update() {
    this.x += this.moveX * this.speed;
    this.y += this.moveY * this.speed;
  }

  onCollision(entity) {
    if (entity instanceof Wall) {
      console.log('Player collided with a wall!');
    }
  }

  fire() {
    const bullet = new Bullet();
    bullet.x = this.x + this.width / 2 - bullet.width / 2;
    bullet.y = this.y + this.height / 2 - bullet.height / 2;
    bullet.moveX = this.moveX;
    bullet.moveY = this.moveY;
    return bullet;
  }
}