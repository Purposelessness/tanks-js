import gameManager from './game-manager.js';
import mapManager from './map-manager.js';

class PhysicsManager {
  update(obj, points = []) {
    if (obj.moveX === 0 && obj.moveY === 0) {
      return false;
    }

    const newX = obj.x + Math.floor(obj.moveX * obj.speed) + 16;
    const newY = obj.y + Math.floor(obj.moveY * obj.speed) + 16;

    const wallAt = this.wallAt(newX, newY, obj.width, obj.height);
    const waterAt = this.waterAt(newX, newY, obj.width, obj.height);

    const e = this.entityAt(obj, newX, newY, obj.width, obj.height);

    if (waterAt && obj.type !== 'Rocket') {
      return false;
    }
    if (e != null && obj.onCollisionEntity) {
      const res = obj.onCollisionEntity(e);
      if (!res) return false;
    }
    if (wallAt && obj.onCollisionTile) {
      const res = obj.onCollisionTile();
      if (!res) return false;
    }

    obj.x = newX - 16;
    obj.y = newY - 16;
    return true;
  }

  wallAt(x, y, width, height) {
    return mapManager.getTilesetIdx('Walls', x - width / 2, y - height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x + width / 2, y - height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x - width / 2, y + height / 2) !== 0 ||
      mapManager.getTilesetIdx('Walls', x + width / 2, y + height / 2) !== 0;
  }

  wallAtTile(x, y) {
    return mapManager.getTilesetIdxByTile('Walls', x, y) !== 0;
  }

  waterAt(x, y, width, height) {
    return mapManager.getTilesetIdx('Background', x - width / 2, y - height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x + width / 2, y - height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x - width / 2, y + height / 2) === 73 ||
      mapManager.getTilesetIdx('Background', x + width / 2, y + height / 2) === 73;
  }

  waterAtTile(x, y) {
    return mapManager.getTilesetIdxByTile('Background', x, y) === 73;
  }

  isTileEmpty(x, y) {
    return !this.wallAtTile(x, y) && !this.waterAtTile(x, y);
  }

  entityAt(obj, x, y, width, height) {
    return gameManager.getEntitiesAsArray().find(e => {
      if (e.id === obj.id) {
        return false;
      }
      return x + width / 2 < e.x + 16 + e.width / 2 &&
        x + width / 2 > e.x + 16 - e.width / 2 &&
        y + height / 2 < e.y + 16 + e.height / 2 &&
        y + height / 2 > e.y + 16 - e.height / 2 ||
        x - width / 2 < e.x + 16 + e.width / 2 &&
        x - width / 2 > e.x + 16 - e.width / 2 &&
        y + height / 2 < e.y + 16 + e.height / 2 &&
        y + height / 2 > e.y + 16 - e.height / 2 ||
        x + width / 2 < e.x + 16 + e.width / 2 &&
        x + width / 2 > e.x + 16 - e.width / 2 &&
        y - height / 2 < e.y + 16 + e.height / 2 &&
        y - height / 2 > e.y + 16 - e.height / 2 ||
        x - width / 2 < e.x + 16 + e.width / 2 &&
        x - width / 2 > e.x + 16 - e.width / 2 &&
        y - height / 2 < e.y + 16 + e.height / 2 &&
        y - height / 2 > e.y + 16 - e.height / 2;
    }) ?? null;
  }
}

const physicsManager = new PhysicsManager();

export default physicsManager;