const BaseRepository = require("./baseRepository");

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  // Helper khusus untuk User
  findByUsername(username) {
    return this.getAll().find((user) => user.username === username);
  }

  getByRole(role) {
    return this.getAll().filter((user) => user.role === role);
  }
}

module.exports = new UserRepository();
