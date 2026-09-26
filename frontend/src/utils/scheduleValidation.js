import { canScheduleStudent } from "./duration";

export const validateScheduleData = ({
  scheduleData,
  users = [],
  students = [],
  subjects = [],
  schedules = [],
}) => {
  const { teacherId, subjectId, students: studentList = [], id } = scheduleData;

  // 1. Validasi Pengajar (Guru atau Pimpinan)
  const teacher = users.find((u) => Number(u.id) === Number(teacherId));
  if (!teacher || (teacher.role !== "guru" && teacher.role !== "pimpinan")) {
    return { valid: false, message: "Pengajar yang dipilih tidak valid." };
  }
  if (!teacher.subjects || !teacher.subjects.includes(Number(subjectId))) {
    return {
      valid: false,
      message: `Pengajar ${teacher.name} tidak mengampu bidang les ini.`,
    };
  }

  // 2. Validasi Jumlah Siswa (Maksimal 6)
  if (!studentList || studentList.length === 0) {
    return { valid: false, message: "Minimal harus memilih 1 siswa." };
  }
  if (studentList.length > 6) {
    return { valid: false, message: "Maksimal 6 siswa per sesi." };
  }

  // 3. Validasi Durasi per Siswa (Maksimal 60 menit)
  for (const s of studentList) {
    if (Number(s.duration) > 60) {
      return {
        valid: false,
        message: "Durasi pembelajaran maksimal 60 menit per sesi.",
      };
    }
  }

  // 4. Validasi Siswa Terdaftar di Bidang Les
  for (const s of studentList) {
    const std = students.find((st) => Number(st.id) === Number(s.studentId));
    if (!std || !std.subjects || !std.subjects.includes(Number(subjectId))) {
      return {
        valid: false,
        message: `Siswa ${std ? std.name : "Unknown"} tidak mengambil bidang les ini.`,
      };
    }
  }

  // 5. Peringatan Target Menit Mingguan
  const warnings = [];
  studentList.forEach((s) => {
    const check = canScheduleStudent(
      s.studentId,
      subjectId,
      s.duration,
      schedules,
      subjects,
      id,
    );
    if (check.warningRequired) {
      const std = students.find((st) => Number(st.id) === Number(s.studentId));
      warnings.push({
        studentName: std ? std.name : "Unknown",
        target: check.weeklyTarget,
        used: check.totalMinutes,
        requested: check.requestedMinutes,
        resulting: check.resultingMinutes,
        excess: check.excessMinutes,
      });
    }
  });

  return { valid: true, warnings };
};
