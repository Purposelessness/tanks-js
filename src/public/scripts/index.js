import gameManager from './managers/game-manager.js';
import highscoreManager from './managers/highscore-manager.js';
import viewManager from './managers/view-manager.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const reloadButton = document.getElementById('reload');
const resetButton = document.getElementById('reset');
const playButton = document.getElementById('play');

reloadButton.addEventListener('click', () => {
  window.location.reload();
});

resetButton.addEventListener('click', () => {
  highscoreManager.clearEntries();
  viewManager.fillScoreBoard();
});

playButton.addEventListener('click', () => {
  gameManager.play();
});

viewManager.fillScoreBoard();

gameManager.canvas = canvas;
gameManager.ctx = ctx;

gameManager.start();
gameManager.load();