class EventsManager {
  binds = [];
  actions = [];

  setup(canvas) {
    this.binds[87] = 'up';
    this.binds[83] = 'down';
    this.binds[65] = 'left';
    this.binds[68] = 'right';
    this.binds[32] = 'fire';

    document.body.addEventListener('keydown', this.onKeyDown);
    document.body.addEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event) => {
    const action = this.binds[event.keyCode];
    if (action) {
      this.actions[action] = true;
    }
  }

  onKeyUp = (event) => {
    const action = this.binds[event.keyCode];
    if (action) {
      this.actions[action] = false;
    }
  }
}

const eventsManager = new EventsManager();

export default eventsManager;