<template>
  <MainLayout>
    <div class="page-header">
      <h2>Jadwal Mengajar</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Kelola dan pantau alokasi jadwal mengajar Guru dan Siswa.
      </p>
    </div>

    <div class="schedule-toolbar">
      <div class="day-tabs">
        <button
          v-for="day in days"
          :key="day"
          class="day-tab"
          :class="{ active: activeDay === day }"
          @click="activeDay = day"
        >
          {{ day }}
        </button>
      </div>

      <button class="btn btn-secondary btn-sm" @click="printJadwal">
        <i class="fas fa-print"></i> Cetak Laporan
      </button>

      <div v-if="canManageSchedule">
        <button class="btn btn-primary" @click="openModal()">
          <i class="fas fa-plus"></i> Tambah Jadwal
        </button>
      </div>
    </div>

    <div class="schedule-table-card">
      <div class="table-responsive">
        <table class="schedule-matrix">
          <thead>
            <tr>
              <th class="time-col">Jam</th>
              <th v-if="teachers.length === 0">Tidak ada Guru / Pimpinan</th>
              <th v-for="t in teachers" :key="t.id">{{ t.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="teachers.length === 0">
              <td class="time-col">-</td>
              <td
                style="text-align: center; padding: 2rem; color: var(--muted)"
              >
                Belum ada data pengajar terdaftar.
              </td>
            </tr>
            <tr v-for="time in timeSlots" :key="time">
              <td class="time-col">{{ time }}</td>
              <td
                v-for="teacher in teachers"
                :key="teacher.id"
                class="slot-cell"
              >
                <div
                  v-for="sched in getSlotSchedules(teacher.id, time)"
                  :key="sched.id"
                  class="schedule-card-item"
                  style="margin-bottom: 0.5rem"
                >
                  <div class="schedule-card-header">
                    <span>{{ getSubjectName(sched.subjectId) }}</span>
                    <span class="badge badge-primary"
                      >{{ sched.students?.length || 0 }}/6 Siswa</span
                    >
                  </div>
                  <ul class="student-list-mini">
                    <li v-for="st in sched.students" :key="st.studentId">
                      <span>{{ getStudentName(st.studentId) }}</span>
                      <small style="color: var(--muted)"
                        >{{ st.duration || 60 }} m</small
                      >
                    </li>
                  </ul>
                  <div v-if="canManageSchedule" class="slot-actions">
                    <button
                      class="btn btn-sm btn-warning btn-edit-sched"
                      @click="openModal(sched)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-danger btn-delete-sched"
                      @click="handleDeleteSchedule(sched.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Schedule -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div class="modal" style="max-width: 600px">
        <div class="modal-header">
          <h3>
            {{ isEditing ? "Edit Jadwal Mengajar" : "Tambah Jadwal Mengajar" }}
          </h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="handleSaveSchedule">
          <div class="modal-body">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem"
            >
              <div class="form-group">
                <label>Hari</label>
                <select v-model="form.day" class="form-control" required>
                  <option v-for="day in days" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Jam Slot</label>
                <select v-model="form.time" class="form-control" required>
                  <option v-for="time in timeSlots" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>

            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem"
            >
              <div class="form-group">
                <label>Bidang Les</label>
                <select
                  v-model="form.subjectId"
                  class="form-control"
                  @change="onSubjectChange"
                  required
                >
                  <option
                    v-for="subj in subjects"
                    :key="subj.id"
                    :value="subj.id"
                  >
                    {{ subj.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Guru / Pimpinan</label>
                <select v-model="form.teacherId" class="form-control" required>
                  <option v-if="availableTeachers.length === 0" value="">
                    -- Tidak ada pengajar --
                  </option>
                  <option
                    v-for="t in availableTeachers"
                    :key="t.id"
                    :value="t.id"
                  >
                    {{ t.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Pilih Siswa & Durasi Belajar (Maksimal 6 Siswa)</label>
              <div class="student-selection-list">
                <div
                  v-if="candidateStudents.length === 0"
                  style="
                    color: var(--muted);
                    font-size: 0.85rem;
                    padding: 0.5rem;
                  "
                >
                  Tidak ada siswa yang mengambil bidang les ini.
                </div>
                <div
                  v-for="item in candidateStudents"
                  :key="item.student.id"
                  class="student-selection-item"
                  :class="{ disabled: item.isDisabled }"
                >
                  <label class="checkbox-item" style="flex: 1">
                    <input
                      type="checkbox"
                      :value="item.student.id"
                      v-model="selectedStudentIds"
                      :disabled="item.isDisabled"
                    />
                    <div>
                      <strong>{{ item.student.name }}</strong
                      ><br />
                      <small style="color: var(--muted); font-size: 0.75rem">{{
                        item.statusText
                      }}</small>
                    </div>
                  </label>
                  <div style="display: flex; align-items: center; gap: 0.25rem">
                    <input
                      type="number"
                      v-model.number="studentDurations[item.student.id]"
                      class="form-control duration-input"
                      min="15"
                      max="60"
                      step="15"
                      :disabled="
                        item.isDisabled ||
                        !selectedStudentIds.includes(item.student.id)
                      "
                    />
                    <small>m</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Batal
            </button>
            <button type="submit" class="btn btn-primary">Simpan Jadwal</button>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MainLayout from "../components/layout/MainLayout.vue";
import { getCurrentUser } from "../services/authService";
import api from "../services/api.js";
import { getWeeklyMinutes, getWeeklyTarget } from "../utils/duration";
import { validateScheduleData } from "../utils/scheduleValidation";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const activeDay = ref("Senin");
const users = ref([]);
const students = ref([]);
const subjects = ref([]);
const schedules = ref([]);

const isModalOpen = ref(false);
const isEditing = ref(false);

const currentUser = getCurrentUser();
const canManageSchedule = computed(
  () => currentUser?.role === "admin" || currentUser?.role === "pimpinan",
);

const form = ref({
  id: null,
  day: "Senin",
  time: "09:00",
  subjectId: null,
  teacherId: null,
});

const selectedStudentIds = ref([]);
const studentDurations = ref({});

const fetchData = async () => {
  try {
    const [uRes, stRes, sbRes, scRes] = await Promise.all([
      api.get("/users"),
      api.get("/students"),
      api.get("/subjects"),
      api.get("/schedules"),
    ]);
    users.value = uRes.data;
    students.value = stRes.data;
    subjects.value = sbRes.data;
    schedules.value = scRes.data;
  } catch (err) {
    console.error("Gagal memuat data jadwal:", err);
  }
};

const teachers = computed(() => {
  return users.value.filter((u) => u.role === "guru" || u.role === "pimpinan");
});

const availableTeachers = computed(() => {
  if (!form.value.subjectId) return [];
  return teachers.value.filter(
    (t) => t.subjects && t.subjects.includes(Number(form.value.subjectId)),
  );
});

const candidateStudents = computed(() => {
  if (!form.value.subjectId) return [];
  const subjectId = Number(form.value.subjectId);
  const targetMinutes = getWeeklyTarget(subjectId, subjects.value);

  const matched = students.value.filter(
    (st) => st.subjects && st.subjects.includes(subjectId),
  );

  return matched.map((std) => {
    const isChecked = selectedStudentIds.value.includes(std.id);
    const usedMinutes = getWeeklyMinutes(
      std.id,
      subjectId,
      schedules.value,
      form.value.id,
    );
    const remaining = Math.max(0, targetMinutes - usedMinutes);
    const isTargetReached = usedMinutes >= targetMinutes;
    const isDisabled = isTargetReached && !isChecked;

    let statusText = `${usedMinutes} / ${targetMinutes} menit`;
    if (isTargetReached && !isChecked) {
      statusText += " (Target Terpenuhi)";
    } else {
      statusText += ` (Sisa ${remaining} m)`;
    }

    return {
      student: std,
      isDisabled,
      statusText,
    };
  });
});

const getSlotSchedules = (teacherId, time) => {
  return schedules.value.filter(
    (s) =>
      s.day === activeDay.value &&
      s.time === time &&
      Number(s.teacherId) === Number(teacherId),
  );
};

const getSubjectName = (id) => {
  const subj = subjects.value.find((s) => Number(s.id) === Number(id));
  return subj ? subj.name : "Unknown";
};

const getStudentName = (id) => {
  const std = students.value.find((s) => Number(s.id) === Number(id));
  return std ? std.name : "Unknown";
};

const onSubjectChange = () => {
  const firstTeacher = availableTeachers.value[0];
  form.value.teacherId = firstTeacher ? firstTeacher.id : null;
};

const openModal = (sched = null) => {
  if (sched) {
    isEditing.value = true;
    form.value = {
      id: sched.id,
      day: sched.day,
      time: sched.time,
      subjectId: Number(sched.subjectId),
      teacherId: Number(sched.teacherId),
    };
    selectedStudentIds.value = (sched.students || []).map((s) =>
      Number(s.studentId),
    );
    studentDurations.value = {};
    (sched.students || []).forEach((s) => {
      studentDurations.value[s.studentId] = s.duration || 60;
    });
  } else {
    isEditing.value = false;
    const initialSubject = subjects.value[0]?.id || null;
    form.value = {
      id: null,
      day: activeDay.value,
      time: "09:00",
      subjectId: initialSubject,
      teacherId: null,
    };
    selectedStudentIds.value = [];
    studentDurations.value = {};
    onSubjectChange();
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveSchedule = async () => {
  if (!form.value.teacherId) {
    alert("Silakan pilih Pengajar terlebih dahulu.");
    return;
  }

  const selectedStudents = selectedStudentIds.value.map((id) => ({
    studentId: Number(id),
    duration: Number(studentDurations.value[id] || 60),
  }));

  const scheduleData = {
    id: form.value.id ? Number(form.value.id) : null,
    day: form.value.day,
    time: form.value.time,
    subjectId: Number(form.value.subjectId),
    teacherId: Number(form.value.teacherId),
    students: selectedStudents,
  };

  const validation = validateScheduleData({
    scheduleData,
    users: users.value,
    students: students.value,
    subjects: subjects.value,
    schedules: schedules.value,
  });

  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  if (validation.warnings && validation.warnings.length > 0) {
    let warnMsg = "PERINGATAN DURASI MELEBIHI TARGET MINGGUAN:\n\n";
    validation.warnings.forEach((w) => {
      warnMsg += `• ${w.studentName}: Target ${w.target}m, Terjadwal ${w.used}m, Baru ${w.requested}m. Total: ${w.resulting}m (+${w.excess}m).\n`;
    });
    warnMsg += "\nApakah Anda tetap ingin menyimpan jadwal ini?";

    if (!confirm(warnMsg)) return;
  }

  try {
    if (isEditing.value) {
      await api.put(`/schedules/${scheduleData.id}`, scheduleData);
    } else {
      await api.post("/schedules", scheduleData);
    }
    closeModal();
    fetchData();
  } catch (err) {
    console.error("Gagal menyimpan jadwal:", err);
  }
};

const handleDeleteSchedule = async (id) => {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus jadwal ini? Durasi siswa dalam jadwal ini akan dibebaskan.",
    )
  ) {
    try {
      await api.delete(`/schedules/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus jadwal:", err);
    }
  }
};

const printJadwal = () => {
  window.print();
};

onMounted(() => {
  fetchData();
});
</script>
