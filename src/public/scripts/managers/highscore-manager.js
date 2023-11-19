class HighscoreManager {
  // Add entry to local storage, max 10 entries
  addEntry(name, score) {
    const entries = this.getEntries();
    entries.push({ name, score });
    entries.sort((a, b) => b.score - a.score);
    if (entries.length > 10) {
      entries.pop();
    }
    console.log(entries);
    localStorage.clear();
    for (let i = 0; i < entries.length; ++i) {
      localStorage.setItem(i.toString(), JSON.stringify({
        name: entries[i].name,
        score: entries[i].score,
      }));
    }
  }

  // Get entries from local storage
  getEntries() {
    const entries = [];
    for (let i = 0; i < localStorage.length; ++i) {
      const value = JSON.parse(localStorage.getItem(i.toString()));
      console.log(value);
      entries.push({ name: value.name, score: value.score });
    }
    console.log(entries);
    return entries;
  }

  clearEntries() {
    localStorage.clear();
  }
}

const highscoreManager = new HighscoreManager();

export default highscoreManager;