class SoundManager {
  clips = {};
  context = null;
  gainNode = null;
  loaded = false;

  start() {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
  }

  load(path, name, callback) {
    if (this.clips[name]) {
      callback(this.clips[name]);
      return;
    }

    const clip = {
      path: path,
      name: name,
      buffer: null,
      loaded: false,
    };
    clip.play = (volume, loop) => {
      this.play(clip.name, { volume: volume || 1, loop: loop || false });
    };
    this.clips[name] = clip;
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      this.context.decodeAudioData(request.response, (buffer) => {
        clip.buffer = buffer;
        clip.loaded = true;
        callback(clip);
      });
    };
    request.send();
  }

  loadArray(array) {
    array.forEach((audio) => {
      this.load(audio.path, audio.name, () => {
        if (Object.keys(this.clips).length === array.length) {
          const unloadedClip = Object.keys(this.clips).find((key) => !this.clips[key].loaded) ?? null;
          this.loaded = unloadedClip === null;
        }
      });
    });
  }

  play(name, settings = {}) {
    if (!this.loaded) {
      setTimeout(() => {
        this.play(name, settings);
      }, 1000);
      return;
    }
    const looping = settings.loop || false;
    const volume = settings.volume || 1;
    const clip = this.clips[name];
    if (clip === null) {
      return false;
    }
    const sound = this.context.createBufferSource();
    sound.buffer = clip.buffer;
    sound.connect(this.gainNode);
    sound.loop = looping;
    this.gainNode.gain.value = volume;
    sound.start(0);
    return true;
  }
}

const soundManager = new SoundManager();

export default soundManager;