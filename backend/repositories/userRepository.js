const BaseRepository = require("./baseRepository");

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  // Helper khusus untuk User
  async findByUsername(username) {
    const snapshot = await this.collection
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  getByRole(role) {
    return this.getAll().filter((user) => user.role === role);
  }
}

module.exports = new UserRepository();
