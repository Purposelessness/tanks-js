import { Enemy } from '../entities/enemy.js';
import { Health } from '../entities/Health.js';
import { Player } from '../entities/player.js';
import { Rocket } from '../entities/rocket.js';

import mapManager from './map-manager.js';
import spriteManager from './sprite-manager.js';

class GameManager {
  ctx = null;

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
    return entity;
  };

  deleteEntity(entity) {
    this.toDelete.push(entity);
  };

  draw(ctx) {
    this.entities.forEach(entity => entity.draw(ctx));
  };

  update() {
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

  load() {
    mapManager.loadMap('/assets/first.tmj');
    spriteManager.loadAtlas('/assets/sprites.json', '/assets/spritesheet.png');
    mapManager.parseEntities();
    mapManager.draw(this.ctx);
  }

  play() {
    this.update();
    requestAnimationFrame(() => this.play());
  }
}

const gameManager = new GameManager();

export default gameManager;