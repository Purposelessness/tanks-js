import gameManager from './game-manager.js';
import mapManager from './map-manager.js';
import physicsManager from './physics-manager.js';
import enemyController from './enemy-controller.js';

import { Node } from './enemy-controller.js';

class EnemyAiController {
  seekRadius = 200;

  start() {
    setInterval(() => {
      this.recalculatePath();
    }, 500);
  }

  // Enemy should follow the player if he is in the radius of 200 pixels
  // Otherwise, the enemy should move randomly
  recalculatePath() {
    Object.keys(enemyController.enemies).forEach(enemyId => {
      const enemy = enemyController.enemies[enemyId].entity;
      this.selectPath(enemy);
      this.shouldFire(enemy);
    });
  }

  isPlayerInRadius(enemy) {
    return Math.abs(enemy.x - gameManager.player.x) < this.seekRadius
      && Math.abs(enemy.y - gameManager.player.y) < this.seekRadius;
  }

  getTiles(enemy) {
    const tSizeX = mapManager.tSize.x;
    const tSizeY = mapManager.tSize.y;

    const playerX = gameManager.player.x + tSizeX / 2;
    const playerY = gameManager.player.y + tSizeY / 2;
    const enemyX = enemy.x + tSizeX / 2;
    const enemyY = enemy.y + tSizeY / 2;

    const playerTileX = Math.floor(playerX / tSizeX);
    const playerTileY = Math.floor(playerY / tSizeY);
    const enemyTileX = Math.floor(enemyX / tSizeX);
    const enemyTileY = Math.floor(enemyY / tSizeY);

    return {
      playerTileX,
      playerTileY,
      enemyTileX,
      enemyTileY,
    };
  }

  shouldFire(enemy) {
    if (this.isPlayerInLineOfSight(enemy)) {
      enemyController.enemies[enemy.id].shouldFire = true;
    }
  }

  isPlayerInLineOfSight(enemy) {
    const tiles = this.getTiles(enemy);
    const { playerTileX, playerTileY, enemyTileX, enemyTileY } = tiles;

    if (playerTileX === enemyTileX) {
      const minY = Math.min(playerTileY, enemyTileY);
      const maxY = Math.max(playerTileY, enemyTileY);
      for (let y = minY; y <= maxY; y++) {
        if (physicsManager.wallAtTile(playerTileX, y)) {
          return false;
        }
      }
      return true;
    } else if (playerTileY === enemyTileY) {
      const minX = Math.min(playerTileX, enemyTileX);
      const maxX = Math.max(playerTileX, enemyTileX);
      for (let x = minX; x <= maxX; x++) {
        if (physicsManager.wallAtTile(x, playerTileY)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  // Enemy should follow the player using A* algorithm
  // Enemy can move only in 4 directions: up, down, left, right
  selectPath(enemy) {
    const tiles = this.getTiles(enemy);
    const { playerTileX, playerTileY, enemyTileX, enemyTileY } = tiles;

    // Path to player
    let path = this.findPath(enemyTileX, enemyTileY, playerTileX, playerTileY);

    if (path.length > 10) {
      const tileToMove = this.findRandomEmptyTile();
      // Path to random tile
      path = this.findPath(enemyTileX, enemyTileY, tileToMove.x, tileToMove.y);
      enemyController.enemies[enemy.id].nextPosition = null;
    }

    if (path.length > 0) {
      path.reverse();
      enemyController.enemies[enemy.id].path = path;
    }
  }

  findPath(startX, startY, endX, endY) {
    const openList = [];
    const closedList = [];
    const path = [];

    const startNode = new Node(startX, startY);
    const endNode = new Node(endX, endY);

    openList.push(startNode);

    while (openList.length > 0) {
      let currentNode = openList[0];
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < currentNode.f) {
          currentNode = openList[i];
        }
      }

      openList.splice(openList.indexOf(currentNode), 1);
      closedList.push(currentNode);

      if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
        let current = currentNode;
        while (current.parent) {
          path.push(current);
          current = current.parent;
        }
        break;
      }

      const neighbors = this.getNeighbors(currentNode);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
          continue;
        }

        const gScore = currentNode.g + 1;
        let gScoreIsBest = false;

        if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
          gScoreIsBest = true;
          neighbor.h = Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y);
          openList.push(neighbor);
        } else {
          gScoreIsBest = gScore < neighbor.g;
        }

        if (gScoreIsBest) {
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    return path;
  }

  getNeighbors(node) {
    const neighbors = [];
    const x = node.x;
    const y = node.y;

    if (x > 0 && physicsManager.isTileEmpty(x - 1, y)) {
      neighbors.push(new Node(x - 1, y));
    }
    if (x < mapManager.xCount - 1 && physicsManager.isTileEmpty(x + 1, y)) {
      neighbors.push(new Node(x + 1, y));
    }
    if (y > 0 && physicsManager.isTileEmpty(x, y - 1)) {
      neighbors.push(new Node(x, y - 1));
    }
    if (y < mapManager.yCount - 1 && physicsManager.isTileEmpty(x, y + 1)) {
      neighbors.push(new Node(x, y + 1));
    }

    return neighbors;
  }

  findRandomEmptyTile() {
    const x = Math.floor(Math.random() * mapManager.xCount);
    const y = Math.floor(Math.random() * mapManager.yCount);

    if (physicsManager.isTileEmpty(x, y)) {
      return { x, y };
    }

    return this.findRandomEmptyTile();
  }
}

const enemyAiController = new EnemyAiController();

export default enemyAiController;