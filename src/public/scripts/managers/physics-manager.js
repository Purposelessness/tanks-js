import gameManager from './game-manager.js';
import mapManager from './map-manager.js';

class PhysicsManager {
  update(obj, points = []) {
    if (obj.moveX === 0 && obj.moveY === 0) {
      return false;
    }

    const newX = obj.x + Math.floor(obj.moveX * obj.speed);
    const newY = obj.y + Math.floor(obj.moveY * obj.speed);

    const wallAt = this.wallAt(newX + obj.width / 2, newY + obj.height / 2);
    const waterAt = this.waterAt(newX + obj.width / 2, newY + obj.height / 2);

    const e = this.entityAt(obj, newX, newY);

    if (waterAt) {
      return false;
    }
    if (e != null && obj.onCollisionEntity) {
      obj.onCollisionEntity(e);
      return false;
    }
    if (wallAt !== 0 && obj.onCollisionTile) {
      obj.onCollisionTile(wallAt);
      return false;
    }

    obj.x = newX;
    obj.y = newY;
    return true;
  }

  wallAt(x, y) {
    return mapManager.getTilesetIdx('Walls', x, y);
  }

  waterAt(x, y) {
    const waterTile = mapManager.getTilesetIdx('Background', x, y);
    return waterTile === 73;
  }

  entityAt(obj, x, y) {
    return gameManager.entities.find(e => {
      if (e === obj) {
        return false;
      }
      console.log(e.width, obj.width);
      return x < e.x + e.width &&
        x + obj.width > e.x &&
        y < e.y + e.height &&
        y + obj.height > e.y;
    }) ?? null;
  }
}

const physicsManager = new PhysicsManager();

export default physicsManager;