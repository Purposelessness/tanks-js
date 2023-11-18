import { Enemy } from '../entities/enemy.js';
import { Health } from '../entities/health.js';
import { Player } from '../entities/player.js';
import { Rocket } from '../entities/rocket.js';
import eventsManager from './events-manager.js';

import mapManager from './map-manager.js';
import spriteManager from './sprite-manager.js';

class GameManager {
  ctx = null;
  canvas = null;

  entities = [];
  toDelete = [];

  player = null;

  factory = {
    'Player': Player,
    'Enemy': Enemy,
    'Rocket': Rocket,
    'Health': Health,
  };

  createEntity = (type, name, x, y, width, height) => {
    const entity = new this.factory[type](name);
    entity.x = x;
    entity.y = y;
    entity.width = width;
    entity.height = height;
    this.entities.push(entity);

    if (type === 'Player') {
      this.player = entity;
    }

    return entity;
  };

  deleteEntity(entity) {
    this.toDelete.push(entity);
  };

  draw(ctx) {
    this.entities.forEach(entity => entity.draw(ctx));
  };

  update() {
    this.doControls();
    this.entities.forEach(entity => entity.update());
    this.toDelete.forEach(entity => {
      const index = this.entities.indexOf(entity);
      if (index > -1) {
        this.entities.splice(index, 1);
      }
    });
    this.toDelete = [];
    mapManager.draw(this.ctx);
    this.draw(this.ctx);
  };

  doControls() {
    if (!this.player) {
      console.log('Player not found!');
      return;
    }

    this.player.moveX = 0;
    this.player.moveY = 0;

    if (eventsManager.actions['up']) {
      this.player.goUp();
    } else if (eventsManager.actions['down']) {
      this.player.goDown();
    } else if (eventsManager.actions['left']) {
      this.player.goLeft();
    } else if (eventsManager.actions['right']) {
      this.player.goRight();
    }

    if (eventsManager.actions['fire']) {
      const bullet = this.player.fire();
      if (bullet) {
        this.entities.push(bullet);
      }
    }
  }

  load() {
    mapManager.loadMap('/assets/first.tmj');
    spriteManager.loadAtlas('/assets/sprites.json', '/assets/spritesheet.png');
    mapManager.parseEntities();
    mapManager.draw(this.ctx);
    eventsManager.setup(this.canvas);
  }

  play() {
    this.update();
    requestAnimationFrame(() => this.play());
  }
}

const gameManager = new GameManager();

export default gameManager;