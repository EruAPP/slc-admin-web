<template>
  <MainLayout>
    <div class="page-header">
      <h2>Jurnal Mengajar Saya</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Pencatatan aktivitas pembelajaran harian dan presensi kehadiran siswa.
      </p>
    </div>

    <!-- Filter Tanggal -->
    <div class="journal-filter-card">
      <div class="form-group">
        <label>Pilih Tanggal Mengajar</label>
        <input type="date" v-model="selectedDate" class="form-control" />
      </div>
      <button class="btn btn-primary" @click="fetchSessions">
        <i class="fas fa-search"></i> Tampilkan Sesi
      </button>
    </div>

    <!-- Tabel Sesi -->
    <div class="card-table">
      <div class="table-header-action">
        <h3>Sesi Mengajar Hari {{ dayName }} ({{ selectedDate }})</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Jam</th>
              <th>Bidang Les</th>
              <th>Jumlah Siswa</th>
              <th>Status Jurnal</th>
              <th style="width: 150px; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredSchedules.length === 0">
              <td
                colspan="5"
                style="text-align: center; color: var(--muted); padding: 1.5rem"
              >
                Tidak ada jadwal mengajar Anda pada hari {{ dayName }}.
              </td>
            </tr>
            <tr v-for="sched in filteredSchedules" :key="sched.id">
              <td>
                <strong>{{ sched.time }}</strong>
              </td>
              <td>{{ getSubjectName(sched.subjectId) }}</td>
              <td>{{ (sched.students || []).length }} Siswa</td>
              <td>
                <span
                  v-if="!getJournalForSchedule(sched.id)"
                  class="badge badge-secondary"
                >
                  <i class="fas fa-minus-circle"></i> Belum Diisi
                </span>
                <template v-else>
                  <span
                    class="badge"
                    :class="
                      getStatusBadgeClass(
                        getJournalForSchedule(sched.id).status,
                      )
                    "
                  >
                    {{ getStatusLabel(getJournalForSchedule(sched.id).status) }}
                  </span>
                  <span
                    v-if="getJournalForSchedule(sched.id).isLate"
                    class="badge badge-danger"
                    style="margin-left: 4px"
                  >
                    <i class="fas fa-exclamation-triangle"></i> Terlambat
                  </span>
                  <span
                    v-else
                    class="badge badge-success"
                    style="margin-left: 4px"
                  >
                    <i class="fas fa-check-circle"></i> Tepat Waktu
                  </span>
                </template>
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="openModal(sched)"
                >
                  <i
                    class="fas"
                    :class="
                      getJournalForSchedule(sched.id) ? 'fa-edit' : 'fa-pen'
                    "
                  ></i>
                  {{
                    getJournalForSchedule(sched.id)
                      ? "Edit / Lihat"
                      : "Isi Jurnal"
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Isi / Edit Jurnal -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div
        class="modal"
        style="
          max-width: 720px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        "
      >
        <div class="modal-header">
          <h3>
            {{ form.id ? "Edit Jurnal Mengajar" : "Isi Jurnal Mengajar Baru" }}
          </h3>
          <button type="button" class="modal-close" @click="closeModal">
            &times;
          </button>
        </div>

        <form
          @submit.prevent="handleSaveJournal"
          style="
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100%;
          "
        >
          <div
            class="modal-body"
            style="overflow-y: auto; max-height: 65vh; padding-right: 0.5rem"
          >
            <!-- Alert Peringatan Terlambat -->
            <div
              v-if="isLateSubmission"
              class="alert-warning-banner"
              style="
                background: #fff3cd;
                color: #856404;
                padding: 0.75rem;
                border-radius: 6px;
                margin-bottom: 1rem;
              "
            >
              <i class="fas fa-exclamation-triangle"></i>
              <strong>Pengisian Terlambat!</strong> Batas waktu pengisian hari
              ini sudah terlewati.
            </div>

            <div
              class="form-group"
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0.75rem;
              "
            >
              <div>
                <label>Tanggal</label>
                <input
                  type="date"
                  :value="selectedDate"
                  class="form-control"
                  readonly
                />
              </div>
              <div>
                <label>Bidang Les</label>
                <input
                  type="text"
                  :value="currentSubjectName"
                  class="form-control"
                  readonly
                />
              </div>
              <div>
                <label>Sesi Mengajar</label>
                <input
                  type="text"
                  :value="currentTimeInfo"
                  class="form-control"
                  readonly
                />
              </div>
            </div>

            <div class="form-group">
              <label>Catatan Umum Kelas (Opsional)</label>
              <textarea
                v-model="form.notes"
                class="form-control"
                rows="2"
                placeholder="Catatan umum kelas..."
              ></textarea>
            </div>

            <!-- Detail Per Siswa -->
            <div class="form-group">
              <label
                style="
                  font-weight: bold;
                  margin-bottom: 0.5rem;
                  display: block;
                  color: var(--primary);
                "
              >
                <i class="fas fa-users"></i> Detail Materi & Capaian Per Siswa
              </label>

              <div
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  max-height: 360px;
                  overflow-y: auto;
                  padding-right: 0.5rem;
                "
              >
                <div
                  v-for="st in currentScheduleStudents"
                  :key="st.studentId"
                  class="student-item-card"
                  style="
                    border: 1px solid var(--border);
                    padding: 0.85rem;
                    border-radius: 8px;
                    background: #f8fafc;
                  "
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 0.5rem;
                    "
                  >
                    <strong style="color: var(--primary); font-size: 0.95rem">
                      <i class="fas fa-user-graduate"></i>
                      {{ getStudentName(st.studentId) }}
                    </strong>
                    <select
                      v-model="attendances[st.studentId].present"
                      class="form-control"
                      style="width: 100px; padding: 0.25rem; font-size: 0.85rem"
                    >
                      <option :value="true">Hadir</option>
                      <option :value="false">Absen</option>
                    </select>
                  </div>

                  <div style="margin-bottom: 0.5rem">
                    <input
                      type="text"
                      v-model="attendances[st.studentId].materi"
                      class="form-control"
                      placeholder="Materi (Contoh: Pecahan)"
                      style="font-size: 0.85rem"
                    />
                  </div>

                  <div
                    style="
                      display: grid;
                      grid-template-columns: 1fr 1fr;
                      gap: 0.5rem;
                      margin-bottom: 0.5rem;
                    "
                  >
                    <input
                      type="text"
                      v-model="attendances[st.studentId].pencapaian"
                      class="form-control"
                      placeholder="Pencapaian (opsional)"
                      style="font-size: 0.85rem"
                    />
                    <input
                      type="text"
                      v-model="attendances[st.studentId].notes"
                      class="form-control"
                      placeholder="Catatan (opsional)"
                      style="font-size: 0.85rem"
                    />
                  </div>

                  <div
                    style="
                      display: grid;
                      grid-template-columns: 1fr 1fr;
                      gap: 0.5rem;
                    "
                  >
                    <input
                      type="text"
                      v-model="attendances[st.studentId].persentase"
                      class="form-control"
                      placeholder="Persentase e.g. 80% (opsional)"
                      style="font-size: 0.85rem"
                    />
                    <input
                      type="text"
                      v-model="attendances[st.studentId].nilai"
                      class="form-control"
                      placeholder="Nilai e.g. 85 (opsional)"
                      style="font-size: 0.85rem"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="modal-footer"
            style="
              margin-top: auto;
              border-top: 1px solid var(--border);
              padding-top: 0.75rem;
            "
          >
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Batal
            </button>
            <button type="submit" class="btn btn-primary">Simpan Jurnal</button>
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
import { checkIsLateSubmission } from "../utils/journalValidation";

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const selectedDate = ref(new Date().toISOString().split("T")[0]);

const currentUser = getCurrentUser();
const schedules = ref([]);
const subjects = ref([]);
const students = ref([]);
const journals = ref([]);

const isModalOpen = ref(false);
const activeSchedule = ref(null);

const form = ref({
  id: null,
  notes: "",
});

const attendances = ref({});

const dayName = computed(() => {
  const d = new Date(selectedDate.value);
  return dayNames[d.getDay()];
});

const filteredSchedules = computed(() => {
  if (!currentUser) return [];
  return schedules.value.filter(
    (s) =>
      Number(s.teacherId) === Number(currentUser.id) && s.day === dayName.value,
  );
});

const isLateSubmission = computed(() => {
  return checkIsLateSubmission(selectedDate.value, new Date());
});

const currentSubjectName = computed(() => {
  if (!activeSchedule.value) return "";
  return getSubjectName(activeSchedule.value.subjectId);
});

const currentTimeInfo = computed(() => {
  if (!activeSchedule.value) return "";
  return `${activeSchedule.value.day}, ${activeSchedule.value.time}`;
});

const currentScheduleStudents = computed(() => {
  if (!activeSchedule.value) return [];
  return activeSchedule.value.students || [];
});

const fetchData = async () => {
  try {
    const [scRes, sbRes, stRes, jRes] = await Promise.all([
      api.get("/schedules"),
      api.get("/subjects"),
      api.get("/students"),
      api.get("/journals"),
    ]);
    schedules.value = scRes.data;
    subjects.value = sbRes.data;
    students.value = stRes.data;
    journals.value = jRes.data;
  } catch (err) {
    console.error("Gagal mengambil data jurnal:", err);
  }
};

const fetchSessions = () => {
  fetchData();
};

const getSubjectName = (id) => {
  const subj = subjects.value.find((s) => Number(s.id) === Number(id));
  return subj ? subj.name : "Unknown";
};

const getStudentName = (id) => {
  const std = students.value.find((s) => Number(s.id) === Number(id));
  return std ? std.name : "Unknown";
};

const getJournalForSchedule = (scheduleId) => {
  return journals.value.find(
    (j) =>
      Number(j.scheduleId) === Number(scheduleId) &&
      j.date === selectedDate.value,
  );
};

const getStatusBadgeClass = (status) => {
  const map = {
    disetujui: "badge-success",
    ditolak: "badge-danger",
    menunggu_review: "badge-warning",
  };
  return map[status] || "badge-warning";
};

const getStatusLabel = (status) => {
  const map = {
    disetujui: "Disetujui",
    ditolak: "Ditolak",
    menunggu_review: "Menunggu Review",
  };
  return map[status] || "Menunggu Review";
};

const openModal = (sched) => {
  activeSchedule.value = sched;
  const existing = getJournalForSchedule(sched.id);

  if (existing) {
    form.value.id = existing.id;
    form.value.notes = existing.notes || "";
  } else {
    form.value.id = null;
    form.value.notes = "";
  }

  // Pre-fill attendances untuk setiap siswa di jadwal
  attendances.value = {};
  (sched.students || []).forEach((st) => {
    const savedAtt = existing?.studentAttendances?.find(
      (a) => Number(a.studentId) === Number(st.studentId),
    );

    attendances.value[st.studentId] = {
      present: savedAtt ? savedAtt.present : true,
      materi: savedAtt ? savedAtt.materi || "" : "",
      pencapaian: savedAtt ? savedAtt.pencapaian || "" : "",
      notes: savedAtt ? savedAtt.notes || "" : "",
      persentase: savedAtt ? savedAtt.persentase || "" : "",
      nilai: savedAtt ? savedAtt.nilai || "" : "",
    };
  });

  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  activeSchedule.value = null;
};

const handleSaveJournal = async () => {
  if (!activeSchedule.value) return;

  const studentAttendances = (activeSchedule.value.students || []).map((st) => {
    const attData = attendances.value[st.studentId] || {};
    return {
      studentId: Number(st.studentId),
      present: attData.present !== undefined ? attData.present : true,
      materi: attData.materi || "",
      pencapaian: attData.pencapaian || "",
      notes: attData.notes || "",
      persentase: attData.persentase || "",
      nilai: attData.nilai || "",
    };
  });

  const payload = {
    id: form.value.id ? Number(form.value.id) : null,
    scheduleId: Number(activeSchedule.value.id),
    teacherId: Number(currentUser.id),
    subjectId: Number(activeSchedule.value.subjectId),
    date: selectedDate.value,
    time: activeSchedule.value.time,
    notes: form.value.notes,
    studentAttendances,
    status: "menunggu_review",
    isLate: isLateSubmission.value,
    submittedAt: new Date().toISOString(),
  };

  try {
    if (form.value.id) {
      await api.put(`/journals/${form.value.id}`, payload);
    } else {
      await api.post("/journals", payload);
    }
    closeModal();
    fetchData();
  } catch (err) {
    console.error("Gagal menyimpan jurnal:", err);
  }
};

onMounted(() => {
  fetchData();
});
</script>
