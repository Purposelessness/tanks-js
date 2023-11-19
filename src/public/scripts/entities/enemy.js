import gameManager from '../managers/game-manager.js';
import { Tank } from './tank.js';

export class Enemy extends Tank {
  onDelete() {
    super.onDelete();
    gameManager.addScore(100);
  }
}