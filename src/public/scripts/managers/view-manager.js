import highscoreManager from './highscore-manager.js';

class ViewManager {
  healthSpan = document.getElementById('health');
  scoreSpan = document.getElementById('score');
  nameInput = document.getElementById('name');

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

  getName() {
    return this.nameInput.value;
  }

  fillScoreBoard() {
    const entries = highscoreManager.getEntries();
    const table = document.getElementById('scoreboard-body');
    table.innerHTML = '';
    entries.forEach((entry) => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      const score = document.createElement('td');
      name.textContent = entry.name;
      score.textContent = entry.score;
      row.appendChild(name);
      row.appendChild(score);
      table.appendChild(row);
    });
  }
}

const viewManager = new ViewManager();

export default viewManager;