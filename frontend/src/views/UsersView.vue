<template>
  <MainLayout>
    <div class="page-header">
      <h2>Kelola User & Guru</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Manajemen akun pengguna sistem dan penugasan bidang mengajar untuk Guru.
      </p>
    </div>

    <div class="card-table">
      <div class="table-header-action">
        <h3>Daftar Pengguna</h3>
        <button class="btn btn-primary" @click="openModal()">
          <i class="fas fa-plus"></i> Tambah User / Guru
        </button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px">No</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Role</th>
              <th>Bidang Mengajar (Guru)</th>
              <th style="width: 140px; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="6" style="text-align: center; color: var(--muted)">
                Belum ada pengguna terdaftar.
              </td>
            </tr>
            <tr v-for="(u, index) in users" :key="u.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ u.name }}</strong>
              </td>
              <td>
                <code>{{ u.username }}</code>
              </td>
              <td>
                <span class="badge" :class="getRoleBadge(u.role)">{{
                  u.role.toUpperCase()
                }}</span>
              </td>
              <td>
                <template v-if="['guru', 'pimpinan'].includes(u.role)">
                  <span
                    v-if="!u.subjects || u.subjects.length === 0"
                    style="color: var(--muted)"
                  >
                    <em>Belum ditugaskan</em>
                  </span>
                  <span
                    v-for="subId in u.subjects"
                    :key="subId"
                    class="badge badge-secondary"
                    style="margin-right: 4px"
                  >
                    {{ getSubjectName(subId) }}
                  </span>
                </template>
                <span v-else>-</span>
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-warning btn-edit"
                  @click="openModal(u)"
                >
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-danger btn-delete"
                  @click="deleteUser(u.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form User -->
    <div class="modal-backdrop" :class="{ active: isModalOpen }">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEditing ? "Edit Pengguna" : "Tambah Pengguna" }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveUser">
          <div class="modal-body">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                v-model="form.name"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Nama Pendek</label>
              <input
                type="text"
                v-model="form.alias"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Username</label>
              <input
                type="text"
                v-model="form.username"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                v-model="form.password"
                class="form-control"
                :required="!isEditing"
                placeholder="Kosongkan jika tidak ingin mengubah password"
              />
            </div>
            <div class="form-group">
              <label>Role User</label>
              <select v-model="form.role" class="form-control" required>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
                <option value="pimpinan">Pimpinan</option>
              </select>
            </div>
            <div
              class="form-group"
              v-if="['guru', 'pimpinan'].includes(form.role)"
            >
              <label>Bidang Les yang Diajar (Khusus Guru)</label>
              <div class="checkbox-grid">
                <span
                  v-if="subjects.length === 0"
                  style="color: var(--muted); font-size: 0.85rem"
                >
                  Belum ada data bidang les.
                </span>
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
import { getCurrentUser } from "../services/authService";
import CryptoJs from "crypto-js";

const currentUser = getCurrentUser();
const users = ref([]);
const subjects = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);

const form = ref({
  name: "",
  alias: "",
  username: "",
  password: "",
  role: "guru",
  subjects: [],
});

const fetchData = async () => {
  try {
    const [userRes, subRes] = await Promise.all([
      api.get("/users"),
      api.get("/subjects"),
    ]);
    users.value = userRes.data;
    subjects.value = subRes.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

const getRoleBadge = (role) => {
  const badges = {
    admin: "badge-danger",
    pimpinan: "badge-warning",
    guru: "badge-primary",
  };
  return badges[role] || "badge-secondary";
};

const getSubjectName = (id) => {
  const subject = subjects.value.find((s) => s.id === id);
  return subject ? subject.name : "Unknown";
};

const openModal = (u = null) => {
  if (u) {
    isEditing.value = true;
    form.value = {
      ...u,
      password: "", // Kosongkan password saat edit agar tidak tertimpa kecuali diisi
      subjects: [...(u.subjects || [])],
    };
  } else {
    isEditing.value = false;
    form.value = {
      name: "",
      alias: "",
      username: "",
      password: "",
      role: "guru",
      subjects: [],
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveUser = async () => {
  // Pastikan subjects kosong jika role bukan guru
  if (!["guru", "pimpinan"].includes(form.value.role)) {
    form.value.subjects = [];
  }

  const payload = { ...form.value };

  try {
    if (isEditing.value) {
      if (payload.password && payload.password.trim() !== "") {
        payload.password = CryptoJs.SHA256(payload.password).toString();
      } else {
        delete payload.password;
      }

      await api.put(`/users/${payload.id}`, payload);
    } else {
      if (payload.password) {
        payload.password = CryptoJs.SHA256(payload.password).toString();
      }

      await api.post("/users", payload);
    }
    closeModal();
    fetchData();
  } catch (error) {
    alert("Gagal menyimpan user. Pastikan username belum digunakan.");
    console.error(error);
  }
};

const deleteUser = async (id) => {
  if (id === currentUser?.id) {
    alert(
      "Anda tidak dapat menghapus akun Anda sendiri yang sedang digunakan!",
    );
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus user:", error);
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
