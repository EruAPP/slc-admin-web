const db = require("../firebase");

class BaseRepository {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async getAll() {
    const snapshot = await this.collection.get();
    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getById(id) {
    const doc = await this.collection.doc(String(id)).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() };
  }

  async create(data) {
    // Menggunakan Auto-Generated ID bawaan Firestore
    const docRef = await this.collection.add(data);
    const doc = await docRef.get();

    return { id: doc.id, ...doc.data() };
  }

  async update(id, data) {
    const docRef = this.collection.doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists) return null;

    await docRef.update(data);
    const updatedDoc = await docRef.get();

    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  async delete(id) {
    const docRef = this.collection.doc(String(id));
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  }
}

module.exports = BaseRepository;
