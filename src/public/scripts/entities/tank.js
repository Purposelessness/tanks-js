import gameManager from '../managers/game-manager.js';
import physicsManager from '../managers/physics-manager.js';
import spriteManager from '../managers/sprite-manager.js';
import { Entity } from './entity.js';
import { Rocket } from './rocket.js';

export class Tank extends Entity {
  spriteName = 'Enemy';

  lastFireDate = 0;
  fireDelay = 500;

  health = 1;

  constructor(isEnemy = true) {
    super(1);
    this.type = 'Tank';
    this.isEnemy = isEnemy;
    this.width = 32;
    this.height = 32;

    if (!isEnemy) {
      this.spriteName = 'Player';
    }
  }


  draw(ctx) {
    spriteManager.drawSprite(ctx, this.spriteName + this.direction, this.x, this.y);
  }

  update() {
    physicsManager.update(this);
  }

  onCollisionEntity(entity) {
    if (this.isEnemy && !entity.isEnemy || !this.isEnemy && entity.isEnemy) {
      gameManager.deleteEntity(this);
      gameManager.deleteEntity(entity);
      return false;
    }
    return this.isEnemy && entity.isEnemy;
  }

  onCollisionTile() {
  }

  fire() {
    if (new Date().getTime() - this.lastFireDate < this.fireDelay) {
      return null;
    }
    this.lastFireDate = new Date().getTime();

    const rocket = new Rocket(this.isEnemy);

    switch (this.direction) {
      case 'Up':
        rocket.x = this.x;
        rocket.y = this.y - 22;
        rocket.goUp();
        break;
      case 'Down':
        rocket.x = this.x;
        rocket.y = this.y + 22;
        rocket.goDown();
        break;
      case 'Left':
        rocket.x = this.x - 22;
        rocket.y = this.y;
        rocket.goLeft();
        break;
      case 'Right':
        rocket.x = this.x + 22;
        rocket.y = this.y;
        rocket.goRight();
        break;
    }

    gameManager.entities[rocket.id] = rocket;
    return rocket;
  }

  dealDamage() {
    this.health--;
    if (this.health <= 0) {
      gameManager.deleteEntity(this);
    }
  }
}