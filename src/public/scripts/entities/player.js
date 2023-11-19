import viewManager from '../managers/view-manager.js';
import { Tank } from './tank.js';

export class Player extends Tank {
  constructor() {
    super(false);
    viewManager.updateHealth(this.health);
  }

  dealDamage() {
    super.dealDamage();
    viewManager.updateHealth(this.health);
  }

  heal() {
    this.health++;
    viewManager.updateHealth(this.health);
  }

  updateHealth(health) {
    this.health = health;
    viewManager.updateHealth(this.health);
  }
}