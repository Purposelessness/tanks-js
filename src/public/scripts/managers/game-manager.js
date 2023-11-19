import { Enemy } from '../entities/enemy.js';
import { Health } from '../entities/health.js';
import { Player } from '../entities/player.js';
import { Rocket } from '../entities/rocket.js';
import eventsManager from './events-manager.js';

import mapManager from './map-manager.js';
import spriteManager from './sprite-manager.js';

class GameManager {
  static uniqueId = 0;

  getUniqueId() {
    return GameManager.uniqueId++;
  }

  ctx = null;
  canvas = null;

  entities = {};
  toDelete = [];

  player = null;
  score = 0;

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
    this.entities[entity.id] = entity;

    if (type === 'Player') {
      this.player = entity;
    }

    return entity;
  };

  deleteEntity(entity) {
    this.toDelete.push(entity);
  };

  forEachEntity(callback) {
    Object.values(this.entities).forEach(callback);
  }

  getEntitiesAsArray() {
    return Object.values(this.entities);
  }

  draw(ctx) {
    this.forEachEntity(entity => entity.draw(ctx));
  };

  update() {
    this.doControls();
    this.forEachEntity(entity => entity.update());
    this.toDelete.forEach(entity => {
      this.entities[entity.id].onDelete();
      delete this.entities[entity.id];
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
        this.entities[bullet.id] = bullet;
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

  addScore(score) {
    this.score += score;
    console.log(`Score: ${this.score}`);
  }
}

const gameManager = new GameManager();

export default gameManager;