class ViewManager {
  healthSpan = document.getElementById('health');
  scoreSpan = document.getElementById('score');

  constructor() {
    this.healthSpan.textContent = 0;
    this.scoreSpan.textContent = 0;
  }

  updateHealth(health) {
    this.healthSpan.textContent = health;
  }

  updateScore(score) {
    this.scoreSpan.textContent = score;
  }
}

const viewManager = new ViewManager();

export default viewManager;