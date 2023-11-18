import gameManager from './game-manager.js';
import mapManager from './map-manager.js';

class PhysicsManager {
  update(obj, points = []) {
    if (obj.moveX === 0 && obj.moveY === 0) {
      return false;
    }

    const newX = obj.x + Math.floor(obj.moveX * obj.speed);
    const newY = obj.y + Math.floor(obj.moveY * obj.speed);

    const wallAt = this.wallAt(newX + 16, newY + 16, obj.width, obj.height);
    const waterAt = this.waterAt(newX + 16, newY + 16, obj.width, obj.height);

    const e = this.entityAt(obj, newX, newY);

    if (waterAt) {
      return false;
    }
    if (e != null && obj.onCollisionEntity) {
      obj.onCollisionEntity(e);
      return false;
    }
    if (wallAt && obj.onCollisionTile) {
      obj.onCollisionTile();
      return false;
    }

    obj.x = newX;
    obj.y = newY;
    return true;
  }

  wallAt(x, y, width, height) {
    return mapManager.getTilesetIdx('Walls', x - width / 2, y - height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x + width / 2, y - height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x - width / 2, y + height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x + width / 2, y + height / 2) !== 0;
  }

  waterAt(x, y, width, height) {
    return mapManager.getTilesetIdx('Background', x - width / 2, y - height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x + width / 2, y - height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x - width / 2, y + height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x + width / 2, y + height / 2) === 73;
  }

  entityAt(obj, x, y) {
    return gameManager.entities.find(e => {
      if (e === obj) {
        return false;
      }
      return x < e.x + e.width &&
        x + obj.width > e.x &&
        y < e.y + e.height &&
        y + obj.height > e.y;
    }) ?? null;
  }
}

const physicsManager = new PhysicsManager();

export default physicsManager;