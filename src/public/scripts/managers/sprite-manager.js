import mapManager from './map-manager.js';

class SpriteManager {
  image = new Image();
  sprites = [];
  jsonLoaded = false;

  loadAtlas(atlasJson, atlasImg) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.parseAtlas(request.responseText);
      }
    };
    request.open('GET', atlasJson, true);
    request.send();

    this.image.onload = () => {
      this.jsonLoaded = true;
    };
    this.image.src = atlasImg;
  }

  parseAtlas(atlasJson) {
    const atlas = JSON.parse(atlasJson);
    for (const name in atlas.frames) {
      const frame = atlas.frames[name].frame;
      this.sprites.push({
        name: name,
        x: frame.x,
        y: frame.y,
        w: frame.w,
        h: frame.h,
      });
    }
    this.jsonLoaded = true;
  }

  drawSprite(ctx, name, x, y) {
    if (!this.jsonLoaded) {
      setTimeout(() => this.drawSprite(ctx, name, x, y), 100);
      return;
    }
    const sprite = this.getSprite(name);
    if (!sprite) {
      console.warn(`Sprite ${name} not found!`);
      return;
    }
    if (!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
      return;
    }

    ctx.drawImage(this.image,
      sprite.x, sprite.y,
      sprite.w, sprite.h,
      x, y,
      sprite.w, sprite.h,
    );
  }

  getSprite(name) {
    return this.sprites.find((sprite) => sprite.name === name) ?? null;
  }
}

const spriteManager = new SpriteManager();

export default spriteManager;