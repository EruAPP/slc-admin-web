const BaseRepository = require("./baseRepository");

class StudentRepository extends BaseRepository {
  constructor() {
    super("students");
  }
}

module.exports = new StudentRepository();
