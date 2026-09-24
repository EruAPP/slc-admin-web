<template>
  <MainLayout>
    <div class="page-header">
      <h2>Kelola Data Siswa</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Daftar siswa beserta pilihan bidang les yang diambil.
      </p>
    </div>

    <div class="card-table">
      <div class="table-header-action">
        <h3>Daftar Siswa</h3>
        <button class="btn btn-primary" @click="openModal()">
          <i class="fas fa-plus"></i> Tambah Siswa
        </button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px">No</th>
              <th>Nama Siswa</th>
              <th>Bidang Les Terdaftar</th>
              <th style="width: 140px; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="students.length === 0">
              <td colspan="4" style="text-align: center; color: var(--muted)">
                Belum ada siswa terdaftar.
              </td>
            </tr>
            <tr v-for="(std, index) in students" :key="std.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ std.name }}</strong>
              </td>
              <td>
                <span
                  v-if="!std.subjects || std.subjects.length === 0"
                  style="color: var(--muted)"
                >
                  <em>Belum memilih</em>
                </span>
                <span
                  v-for="subId in std.subjects"
                  :key="subId"
                  class="badge badge-primary"
                  style="margin-right: 4px"
                >
                  {{ getSubjectName(subId) }}
                </span>
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-warning btn-edit"
                  @click="openModal(std)"
                >
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-danger btn-delete"
                  @click="deleteStudent(std.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Siswa -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEditing ? "Edit Data Siswa" : "Tambah Siswa Baru" }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveStudent">
          <div class="modal-body">
            <div class="form-group">
              <label>Nama Lengkap Siswa</label>
              <input
                type="text"
                v-model="form.name"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Pilih Bidang Les</label>
              <div class="checkbox-grid">
                <span
                  v-if="subjects.length === 0"
                  style="color: var(--muted); font-size: 0.85rem"
                  >Belum ada data bidang les.</span
                >
                <label
                  v-for="subj in subjects"
                  :key="subj.id"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :value="subj.id"
                    v-model="form.subjects"
                  />
                  {{ subj.name }}
                </label>
              </div>
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

const students = ref([]);
const subjects = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, name: "", subjects: [] });

const fetchData = async () => {
  const [stdRes, subRes] = await Promise.all([
    api.get("/api/students"),
    api.get("/api/subjects"),
  ]);
  students.value = stdRes.data;
  subjects.value = subRes.data;
};

const getSubjectName = (id) => {
  const subject = subjects.value.find((s) => s.id === id);
  return subject ? subject.name : "Unknown";
};

const openModal = (std = null) => {
  if (std) {
    isEditing.value = true;
    form.value = { ...std, subjects: [...(std.subjects || [])] };
  } else {
    isEditing.value = false;
    form.value = { id: null, name: "", subjects: [] };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveStudent = async () => {
  if (isEditing.value) {
    await api.put(`/api/students/${form.value.id}`, form.value);
  } else {
    await api.post("/api/students", form.value);
  }
  closeModal();
  fetchData();
};

const deleteStudent = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
    await api.delete(`/api/students/${id}`);
    fetchData();
  }
};

onMounted(() => fetchData());
</script>
