const BaseRepository = require("./baseRepository");

class JournalRepository extends BaseRepository {
  constructor() {
    super("journals");
  }

  getByScheduleAndDate(scheduleId, date) {
    return this.getAll().find(
      (j) => Number(j.scheduleId) === Number(scheduleId) && j.date === date,
    );
  }

  getByTeacher(teacherId) {
    return this.getAll().filter(
      (j) => Number(j.teacherId) === Number(teacherId),
    );
  }
}

module.exports = new JournalRepository();
