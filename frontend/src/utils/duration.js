export function getWeeklyMinutes(
  studentId,
  subjectId,
  schedules = [],
  excludeScheduleId = null,
) {
  let totalMinutes = 0;

  schedules.forEach((schedule) => {
    if (!schedule) return;
    if (excludeScheduleId && Number(schedule.id) === Number(excludeScheduleId))
      return;

    if (Number(schedule.subjectId) === Number(subjectId)) {
      const studentList = Array.isArray(schedule.students)
        ? schedule.students
        : [];
      const studentEntry = studentList.find(
        (s) => Number(s.studentId) === Number(studentId),
      );
      if (studentEntry) {
        totalMinutes += Number(studentEntry.duration || 60);
      }
    }
  });

  return totalMinutes;
}

export function getWeeklyTarget(subjectId, subjects = []) {
  const subject = subjects.find((s) => Number(s.id) === Number(subjectId));
  return subject ? Number(subject.weeklyMinutes || 120) : 120;
}

export function canScheduleStudent(
  studentId,
  subjectId,
  requestedDuration,
  schedules = [],
  subjects = [],
  excludeScheduleId = null,
) {
  const target = getWeeklyTarget(subjectId, subjects);
  const currentUsed = getWeeklyMinutes(
    studentId,
    subjectId,
    schedules,
    excludeScheduleId,
  );
  const resulting = currentUsed + Number(requestedDuration);

  if (resulting <= target) {
    return {
      allowed: true,
      warningRequired: false,
      totalMinutes: currentUsed,
      weeklyTarget: target,
      remainingMinutes: target - resulting,
    };
  } else {
    return {
      allowed: true,
      warningRequired: true,
      totalMinutes: currentUsed,
      weeklyTarget: target,
      requestedMinutes: Number(requestedDuration),
      resultingMinutes: resulting,
      excessMinutes: resulting - target,
    };
  }
}
