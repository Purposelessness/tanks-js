import { Enemy } from '../entities/enemy.js';
import { HealthUp } from '../entities/health-up.js';
import { Player } from '../entities/player.js';
import { Rocket } from '../entities/rocket.js';
import enemyAiController from './enemy-ai-controller.js';
import enemyController, { EnemyData } from './enemy-controller.js';
import eventsManager from './events-manager.js';
import highscoreManager from './highscore-manager.js';

import mapManager from './map-manager.js';
import spriteManager from './sprite-manager.js';
import viewManager from './view-manager.js';

class GameManager {
  static uniqueId = 0;
  isPlaying = false;
  interval = null;

  maps = [
    '/assets/first.tmj',
    '/assets/second.tmj',
  ];
  level = 1;
  enemies = 0;

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
    'HealthUp': HealthUp,
  };

  createEntity = (type, name, x, y, width, height) => {
    const entity = new this.factory[type]();
    const fitPosition = mapManager.fitPositionToTile(x, y);
    entity.x = fitPosition.x;
    entity.y = fitPosition.y;
    entity.width = width;
    entity.height = height;
    this.entities[entity.id] = entity;

    if (type === 'Player') {
      this.player = entity;
    } else if (type === 'Enemy') {
      ++this.enemies;
      entity.health = Math.floor((this.level + 1) / 2);
      enemyController.enemies[entity.id] = new EnemyData(entity);
    }

    return entity;
  };

  deleteEntity(entity) {
    this.toDelete.push(entity);
    if (entity.type === 'Tank') {
      if (entity.isEnemy) {
        delete enemyController.enemies[entity.id];
        --this.enemies;
        if (this.enemies === 0) {
          this.addScore(100);
          this.nextLevel();
        }
      } else {
        if (this.score > 0) {
          console.log(`Adding highscore ${this.score}`);
          highscoreManager.addEntry(viewManager.getName(), this.score);
        }
        this.stop();
      }
    }
  }

  forEachEntity(callback) {
    Object.values(this.entities).forEach(callback);
  }

  getEntitiesAsArray() {
    return Object.values(this.entities);
  }

  draw(ctx) {
    this.forEachEntity(entity => entity.draw(ctx));
  };

  updateLoop() {
    this.doControls();
    enemyController.update();
    this.forEachEntity(entity => entity.update());
    this.toDelete.forEach(entity => {
      try {
        this.entities[entity.id].onDelete();
        delete this.entities[entity.id];
      } catch (e) {
        console.log(e);
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

    this.player.stop();

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
      this.player.fire();
    }
  }

  start() {
    eventsManager.setup(this.canvas);
    spriteManager.loadAtlas('/assets/sprites.json', '/assets/spritesheet.png');
  }

  load() {
    const map = this.maps[(this.level - 1) % 2];
    console.log(`Loading map ${map}`);
    mapManager.loadMap(map);
    mapManager.parseEntities();
    mapManager.draw(this.ctx);
  }

  nextLevel() {
    ++this.level;
    this.stop();
    this.load();
    this.play();
  }

  update() {
    if (!this.isPlaying) {
      return;
    }
    this.updateLoop();
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.interval = setInterval(() => {
      this.update();
    }, 10);
    enemyAiController.start();
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.interval);
    enemyAiController.stop();
    this.entities = {};
    this.toDelete = [];
    this.player = null;
    mapManager.clear();
  }

  addScore(score) {
    this.score += score * this.level;
    console.log(`Score: ${this.score}`);
    viewManager.updateScore(this.score);
  }
}

const gameManager = new GameManager();

export default gameManager;