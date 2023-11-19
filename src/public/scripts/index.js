import gameManager from './managers/game-manager.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoreSpan = document.getElementById('score');
const reloadButton = document.getElementById('reload');

reloadButton.addEventListener('click', () => {
  window.location.reload();
});

gameManager.canvas = canvas;
gameManager.ctx = ctx;

gameManager.load();
gameManager.play();