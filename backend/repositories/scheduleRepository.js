const BaseRepository = require("./baseRepository");

class ScheduleRepository extends BaseRepository {
  constructor() {
    super("schedules");
  }

  getByDay(day) {
    return this.getAll().filter((s) => s.day === day);
  }

  getByTeacher(teacherId) {
    return this.getAll().filter(
      (s) => Number(s.teacherId) === Number(teacherId),
    );
  }
}

module.exports = new ScheduleRepository();
