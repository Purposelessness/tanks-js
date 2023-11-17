import { MapManager } from './managers/map-manager.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mapManager = new MapManager(ctx);

mapManager.loadMap('/assets/first.tmj');
mapManager.draw();