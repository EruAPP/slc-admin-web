const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../database.json");

const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

class BaseRepository {
  constructor(collectionName) {
    this.collection = collectionName;
  }
  getAll() {
    return readDB()[this.collection];
  }
  getById(id) {
    return this.getAll().find((item) => item.id === parseInt(id));
  }
  create(data) {
    const db = readDB();
    const newItem = { id: Date.now(), ...data };
    db[this.collection].push(newItem);
    writeDB(db);
    return newItem;
  }
  update(id, data) {
    const db = readDB();
    const index = db[this.collection].findIndex(
      (item) => item.id === parseInt(id),
    );
    if (index !== -1) {
      db[this.collection][index] = { ...db[this.collection][index], ...data };
      writeDB(db);
      return db[this.collection][index];
    }
    return null;
  }
}
module.exports = BaseRepository;
