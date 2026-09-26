<template>
  <MainLayout>
    <div class="page-header">
      <h2>Review Jurnal Mengajar Guru</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Monitoring laporan aktivitas pengajaran dan persetujuan jurnal harian.
      </p>
    </div>

    <!-- Filter Card -->
    <div class="journal-filter-card">
      <div class="form-group">
        <label>Pilih Guru</label>
        <select v-model="filterTeacherId" class="form-control">
          <option value="">-- Semua Guru --</option>
          <option v-for="t in teachers" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Status Review</label>
        <select v-model="filterStatus" class="form-control">
          <option value="">-- Semua Status --</option>
          <option value="menunggu_review">Menunggu Review</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="fetchData">
        <i class="fas fa-filter"></i> Filter
      </button>
    </div>

    <!-- Data Table -->
    <div class="card-table">
      <div class="table-header-action">
        <h3>Daftar Jurnal Terkirim</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tanggal / Jam</th>
              <th>Guru</th>
              <th>Bidang Les</th>
              <th>Topik / Ringkasan Materi</th>
              <th>Status</th>
              <th style="width: 140px; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredJournals.length === 0">
              <td
                colspan="6"
                style="text-align: center; color: var(--muted); padding: 1.5rem"
              >
                Tidak ada jurnal yang sesuai kriteria filter.
              </td>
            </tr>
            <tr v-for="j in filteredJournals" :key="j.id">
              <td>
                <strong>{{ j.date }}</strong
                ><br />
                <small style="color: var(--muted)">{{ j.time }}</small>
              </td>
              <td>{{ getTeacherName(j.teacherId) }}</td>
              <td>{{ getSubjectName(j.subjectId) }}</td>
              <td>
                <div
                  style="
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  :title="getMateriSummary(j)"
                >
                  {{ getMateriSummary(j) }}
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(j.status)">
                  {{ getStatusLabel(j.status) }}
                </span>
                <span
                  v-if="j.isLate"
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
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="openReviewModal(j)"
                >
                  <i class="fas fa-search"></i> Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Review Jurnal Pimpinan -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div
        class="modal"
        style="
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        "
      >
        <div class="modal-header">
          <h3>Detail & Review Jurnal</h3>
          <button type="button" class="modal-close" @click="closeModal">
            &times;
          </button>
        </div>

        <div
          v-if="selectedJournal"
          class="modal-body"
          style="overflow-y: auto; max-height: 70vh; padding-right: 0.5rem"
        >
          <div
            style="
              background: #f8fafc;
              padding: 1rem;
              border-radius: var(--radius);
              border: 1px solid var(--border);
              margin-bottom: 1rem;
            "
          >
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                font-size: 0.9rem;
              "
            >
              <p style="margin: 0">
                <strong>Guru:</strong>
                {{ getTeacherName(selectedJournal.teacherId) }}
              </p>
              <p style="margin: 0">
                <strong>Bidang Les:</strong>
                {{ getSubjectName(selectedJournal.subjectId) }}
              </p>
              <p style="margin: 0">
                <strong>Tanggal & Jam:</strong> {{ selectedJournal.date }} ({{
                  selectedJournal.time
                }})
              </p>
              <p style="margin: 0">
                <strong>Status Terlambat:</strong>
                <span
                  v-if="selectedJournal.isLate"
                  style="color: var(--danger); font-weight: bold"
                  >TERLAMBAT</span
                >
                <span v-else style="color: var(--success); font-weight: bold"
                  >TEPAT WAKTU</span
                >
              </p>
            </div>

            <div v-if="selectedJournal.notes">
              <hr
                style="
                  margin: 0.75rem 0;
                  border: 0;
                  border-top: 1px solid var(--border);
                "
              />
              <p style="margin: 0; font-size: 0.9rem">
                <strong>Catatan Umum Kelas:</strong> {{ selectedJournal.notes }}
              </p>
            </div>
          </div>

          <div>
            <h4
              style="
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
                color: var(--primary);
              "
            >
              <i class="fas fa-list-check"></i> Detail Capaian & Presensi Siswa
              ({{ (selectedJournal.studentAttendances || []).length }} Siswa)
            </h4>
            <div
              style="
                max-height: 280px;
                overflow-y: auto;
                padding-right: 0.25rem;
              "
            >
              <div
                v-if="
                  !selectedJournal.studentAttendances ||
                  selectedJournal.studentAttendances.length === 0
                "
                style="color: var(--muted); font-size: 0.85rem"
              >
                Tidak ada detail siswa.
              </div>
              <div
                v-for="att in selectedJournal.studentAttendances"
                :key="att.studentId"
                style="
                  background: #ffffff;
                  border: 1px solid var(--border);
                  padding: 0.75rem;
                  border-radius: 6px;
                  margin-bottom: 0.5rem;
                "
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.4rem;
                  "
                >
                  <strong style="color: var(--primary); font-size: 0.9rem">
                    <i class="fas fa-user-graduate"></i>
                    {{ getStudentName(att.studentId) }}
                  </strong>
                  <span v-if="att.present" class="badge badge-success"
                    ><i class="fas fa-check-circle"></i> Hadir</span
                  >
                  <span v-else class="badge badge-danger"
                    ><i class="fas fa-times-circle"></i> Absen</span
                  >
                </div>

                <div
                  style="
                    font-size: 0.85rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                  "
                >
                  <div><strong>Materi:</strong> {{ att.materi || "-" }}</div>
                  <div>
                    <strong>Capaian:</strong> {{ att.pencapaian || "-" }}
                  </div>
                  <div style="display: flex; gap: 1rem; color: #475569">
                    <span><strong>Nilai:</strong> {{ att.nilai || "-" }}</span>
                    <span
                      ><strong>Persentase:</strong>
                      {{ att.persentase || "-" }}</span
                    >
                  </div>
                  <div
                    v-if="att.notes"
                    style="color: #64748b; font-style: italic"
                  >
                    <strong>Catatan Siswa:</strong> {{ att.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1.25rem">
            <label style="font-weight: bold; color: var(--primary)">
              Catatan / Feedback Pimpinan
            </label>
            <textarea
              v-model="reviewNotes"
              class="form-control"
              rows="3"
              placeholder="Masukkan masukan atau alasan jika terjadi penolakan..."
            ></textarea>
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
          <button
            type="button"
            class="btn btn-danger"
            @click="updateJournalStatus('ditolak')"
          >
            <i class="fas fa-times"></i> Tolak
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateJournalStatus('disetujui')"
          >
            <i class="fas fa-check"></i> Setujui
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MainLayout from "../components/layout/MainLayout.vue";
import api from "../services/api.js";

const users = ref([]);
const subjects = ref([]);
const students = ref([]);
const journals = ref([]);

const filterTeacherId = ref("");
const filterStatus = ref("");

const isModalOpen = ref(false);
const selectedJournal = ref(null);
const reviewNotes = ref("");

const fetchData = async () => {
  try {
    const [uRes, sbRes, stRes, jRes] = await Promise.all([
      api.get("/users"),
      api.get("/subjects"),
      api.get("/students"),
      api.get("/journals"),
    ]);
    users.value = uRes.data;
    subjects.value = sbRes.data;
    students.value = stRes.data;
    journals.value = jRes.data;
  } catch (err) {
    console.error("Gagal mengambil data review jurnal:", err);
  }
};

const teachers = computed(() => {
  return users.value.filter((u) => u.role === "guru" || u.role === "pimpinan");
});

const filteredJournals = computed(() => {
  let list = journals.value;
  if (filterTeacherId.value) {
    list = list.filter(
      (j) => Number(j.teacherId) === Number(filterTeacherId.value),
    );
  }
  if (filterStatus.value) {
    list = list.filter((j) => j.status === filterStatus.value);
  }
  return list;
});

const getTeacherName = (id) => {
  const u = users.value.find((user) => Number(user.id) === Number(id));
  return u ? u.name : "Unknown";
};

const getSubjectName = (id) => {
  const subj = subjects.value.find((s) => Number(s.id) === Number(id));
  return subj ? subj.name : "Unknown";
};

const getStudentName = (id) => {
  const std = students.value.find((s) => Number(s.id) === Number(id));
  return std ? std.name : "Unknown";
};

const getMateriSummary = (journal) => {
  if (!journal.studentAttendances || journal.studentAttendances.length === 0) {
    return journal.topic || "-";
  }

  const materiList = journal.studentAttendances
    .map((att) => (att.materi ? att.materi.trim() : ""))
    .filter((m) => m !== "");

  if (materiList.length === 0) {
    return journal.topic || "-";
  }

  const uniqueMateri = [...new Set(materiList)];
  return uniqueMateri.join(", ");
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

const openReviewModal = (journal) => {
  selectedJournal.value = journal;
  reviewNotes.value = journal.reviewNotes || "";
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedJournal.value = null;
  reviewNotes.value = "";
};

const updateJournalStatus = async (newStatus) => {
  if (!selectedJournal.value) return;

  const payload = {
    ...selectedJournal.value,
    status: newStatus,
    reviewNotes: reviewNotes.value,
    reviewedAt: new Date().toISOString(),
  };

  try {
    await api.put(`/journals/${selectedJournal.value.id}`, payload);
    closeModal();
    fetchData();
  } catch (err) {
    console.error("Gagal memperbarui status jurnal:", err);
  }
};

onMounted(() => {
  fetchData();
});
</script>
