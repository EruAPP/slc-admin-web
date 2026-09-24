const BaseRepository = require("./baseRepository");

class SubjectRepository extends BaseRepository {
  constructor() {
    super("subjects");
  }
}

module.exports = new SubjectRepository();
