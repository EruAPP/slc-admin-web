<template>
  <MainLayout>
    <div class="page-header">
      <h2>Kelola Bidang Les</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Kelola mata pelajaran dan alokasi durasi target mingguan.
      </p>
    </div>

    <div class="card-table">
      <div class="table-header-action">
        <h3>Daftar Bidang Les</h3>
        <button class="btn btn-primary" @click="openModal()">
          <i class="fas fa-plus"></i> Tambah Bidang
        </button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px">No</th>
              <th>Nama Bidang</th>
              <th>Menit / Minggu</th>
              <th style="width: 140px; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="subjects.length === 0">
              <td colspan="4" style="text-align: center; color: var(--muted)">
                Belum ada bidang les.
              </td>
            </tr>
            <tr v-for="(subj, index) in subjects" :key="subj.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ subj.name }}</strong>
              </td>
              <td>{{ subj.weeklyMinutes }} menit</td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-warning btn-edit"
                  @click="openModal(subj)"
                >
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-danger btn-delete"
                  @click="deleteSubject(subj.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Subject -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEditing ? "Edit Bidang Les" : "Tambah Bidang Les" }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveSubject">
          <div class="modal-body">
            <div class="form-group">
              <label for="subjectName">Nama Bidang</label>
              <input
                type="text"
                v-model="form.name"
                class="form-control"
                placeholder="Contoh: Math, Coding"
                required
              />
            </div>
            <div class="form-group">
              <label for="weeklyMinutes">Berapa Menit per Minggu</label>
              <input
                type="number"
                v-model="form.weeklyMinutes"
                class="form-control"
                min="30"
                step="15"
                required
              />
              <small class="form-text-muted">
                Durasi belajar yang ditargetkan setiap siswa untuk bidang ini
                dalam satu minggu.
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Batal
            </button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";
import MainLayout from "../components/layout/MainLayout.vue";

const subjects = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, name: "", weeklyMinutes: 120 });

const fetchSubjects = async () => {
  const res = await api.get("/subjects"); // Sesuaikan baseURL
  subjects.value = res.data;
};

const openModal = (subj = null) => {
  if (subj) {
    isEditing.value = true;
    form.value = { ...subj };
  } else {
    isEditing.value = false;
    form.value = { id: null, name: "", weeklyMinutes: 120 };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveSubject = async () => {
  if (isEditing.value) {
    await api.put(`/subjects/${form.value.id}`, form.value);
  } else {
    await api.post("/subjects", form.value);
  }
  closeModal();
  fetchSubjects();
};

const deleteSubject = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus bidang les ini?")) {
    await api.delete(`/subjects/${id}`);
    fetchSubjects();
  }
};

onMounted(() => fetchSubjects());
</script>
