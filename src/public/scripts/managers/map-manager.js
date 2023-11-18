import gameManager from './game-manager.js';

export class MapManager {
  mapData = null;
  xCount = 0;
  yCount = 0;
  tSize = { x: 32, y: 32 };
  mapSize = { x: 32, y: 32 };
  tilesets = [];

  view = { x: 0, y: 0, w: 1000, h: 1000 };

  loadMap(path) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.parseMap(request.responseText);
      }
    };
    request.open('GET', path, true);
    request.send();
  }

  loadTileset(path, callback) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        callback(JSON.parse(request.responseText));
      }
    };
    request.open('GET', path, true);
    request.send();
  }

  parseMap(tilesJson) {
    this.mapData = JSON.parse(tilesJson);
    this.xCount = this.mapData.width;
    this.yCount = this.mapData.height;
    this.tSize.x = this.mapData.tilewidth;
    this.tSize.y = this.mapData.tileheight;
    this.mapSize.x = this.xCount * this.tSize.x;
    this.mapSize.y = this.yCount * this.tSize.y;

    for (let i = 0; i < this.mapData.tilesets.length; ++i) {
      const img = new Image();
      const t = this.mapData.tilesets[i];
      this.loadTileset(`/assets/${t.source}`, (tileset) => {
        img.src = `/assets/${tileset.image}`;
        const ts = {
          firstgid: t.firstgid,
          image: img,
          name: t.name,
          xCount: Math.floor(tileset.imagewidth / this.tSize.x),
          yCount: Math.floor(tileset.imageheight / this.tSize.y),
        };
        this.tilesets.push(ts);
      });
    }

    this.jsonLoaded = true;
  }

  isImgLoaded() {
    return this.tilesets && this.mapData &&
      this.tilesets.length === this.mapData.tilesets.length;
  }

  draw(ctx) {
    if (!this.jsonLoaded || !this.isImgLoaded()) {
      setTimeout(() => this.draw(ctx), 100);
      return;
    }

    for (let id = 0; id < this.mapData.layers.length; ++id) {
      const layer = this.mapData.layers[id];
      if (!layer.data) {
        continue;
      }

      for (let i = 0; i < layer.data.length; ++i) {
        if (layer.data[i] === 0) {
          continue;
        }
        const tile = this.getTile(layer.data[i]);
        let pX = (i % this.xCount) * this.tSize.x;
        let pY = Math.floor(i / this.xCount) * this.tSize.y;
        if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
          continue;
        }
        pX -= this.view.x;
        pY -= this.view.y;
        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
      }
    }
  }

  isVisible(x, y, width, height) {
    return !(x + width < this.view.x || x > this.view.x + this.view.w ||
      y + height < this.view.y || y > this.view.y + this.view.h);
  }

  getTile(tileIndex) {
    const tile = {
      img: null, px: 0, py: 0,
    };
    const tileset = this.getTileset(tileIndex);
    tile.img = tileset.image;
    const id = tileIndex - tileset.firstgid;
    const x = id % tileset.xCount;
    const y = Math.floor(id / tileset.xCount);
    tile.px = x * this.tSize.x;
    tile.py = y * this.tSize.y;
    return tile;
  }

  getTileset(tileIndex) {
    return this.tilesets.find(tileset => tileset.firstgid <= tileIndex) ?? null;
  }

  parseEntities() {
    if (!this.jsonLoaded || !this.isImgLoaded()) {
      setTimeout(() => this.parseEntities(), 100);
      return;
    }

    for (let id = 0; id < this.mapData.layers.length; ++id) {
      const layer = this.mapData.layers[id];
      if (!layer.objects || layer.type !== 'objectgroup') {
        continue;
      }

      for (let i = 0; i < layer.objects.length; ++i) {
        const entity = layer.objects[i];
        gameManager.createEntity(
          entity.type, entity.name,
          entity.x, entity.y,
          entity.width, entity.height,
        );
      }
    }
  }

  getTilesetIdx(layer, x, y) {
    const wX = Math.floor(x / this.tSize.x);
    const wY = Math.floor(y / this.tSize.y);
    const idx = wY * this.xCount + wX;
    return layer.data[idx];
  }

}

const mapManager = new MapManager();

export default mapManager;