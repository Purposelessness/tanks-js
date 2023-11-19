import mapManager from './map-manager.js';

export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.parent = null;
  }
}

export class EnemyData {
  entity = null;
  // Path is an array of nodes
  path = [];
  nextPosition = null;

  constructor(entity) {
    this.entity = entity;
  }
}

class EnemyController {
  // Enemies is an object with enemyId as key and EnemyData as value
  enemies = {};

  update() {
    Object.keys(this.enemies).forEach(enemyId => {
      const enemyData = this.enemies[enemyId];
      this.updateEnemy(enemyData);
    });
  }

  // Move enemy to the next node in the path
  // Enemies move by tile, Node position is in tiles
  // Enemy position is in pixels
  // nextPosition is in pixels and is the next position the enemy should move to
  updateEnemy(enemyData) {
    if (!enemyData.entity || enemyData.path.length < 2) {
      return;
    }

    const enemy = enemyData.entity;

    if (!enemyData.nextPosition) {
      enemyData.nextPosition = this.convertTilePositionToPixels(enemyData.path.shift());
    }

    const nextPosition = enemyData.nextPosition;

    if (Math.abs(enemy.x - nextPosition.x) < 4 && Math.abs(enemy.y - nextPosition.y) < 4) {
      enemyData.nextPosition = this.convertTilePositionToPixels(enemyData.path.shift());
      enemy.stop();
      enemy.x = nextPosition.x;
      enemy.y = nextPosition.y;
      return;
    }

    if (enemy.x < nextPosition.x) {
      enemy.goRight();
    } else if (enemy.x > nextPosition.x) {
      enemy.goLeft();
    } else if (enemy.y < nextPosition.y) {
      enemy.goDown();
    } else if (enemy.y > nextPosition.y) {
      enemy.goUp();
    }
  }

  convertTilePositionToPixels(position) {
    const tSizeX = mapManager.tSize.x;
    const tSizeY = mapManager.tSize.y;
    return {
      x: position.x * tSizeX,
      y: position.y * tSizeY,
    };
  }
}

const enemyController = new EnemyController();

export default enemyController;