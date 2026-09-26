<template>
  <MainLayout>
    <div class="page-header">
      <h2>Dashboard Administrasi</h2>
      <p style="color: var(--muted); font-size: 0.9rem">
        Selamat datang di Sistem Administrasi LKP Smart Learning Center.
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="stats-grid">
      <!-- TAMPILAN ADMIN -->
      <template v-if="user?.role === 'admin'">
        <div class="stat-card">
          <div class="stat-icon bg-blue"><i class="fas fa-users"></i></div>
          <div class="stat-details">
            <h4>Total User</h4>
            <h2>{{ stats.usersCount }}</h2>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-green">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
          <div class="stat-details">
            <h4>Total Guru</h4>
            <h2>{{ stats.guruCount }}</h2>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-orange">
            <i class="fas fa-user-graduates"></i>
          </div>
          <div class="stat-details">
            <h4>Total Siswa</h4>
            <h2>{{ stats.studentCount }}</h2>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="stat-details">
            <h4>Bidang Les</h4>
            <h2>{{ stats.subjectCount }}</h2>
          </div>
        </div>
      </template>

      <!-- TAMPILAN PIMPINAN -->
      <template v-else-if="user?.role === 'pimpinan'">
        <div class="stat-card">
          <div class="stat-icon bg-green">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
          <div class="stat-details">
            <h4>Total Guru</h4>
            <h2>{{ stats.guruCount }}</h2>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-orange">
            <i class="fas fa-user-graduates"></i>
          </div>
          <div class="stat-details">
            <h4>Total Siswa</h4>
            <h2>{{ stats.studentCount }}</h2>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-danger"><i class="fas fa-tasks"></i></div>
          <div class="stat-details">
            <h4>Jurnal Menunggu Periksa</h4>
            <h2>{{ stats.pendingJournalCount }}</h2>
          </div>
        </div>
      </template>

      <!-- TAMPILAN GURU -->
      <template v-else-if="user?.role === 'guru'">
        <div class="stat-card">
          <div class="stat-icon bg-blue">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-details">
            <h4>Jadwal Mengajar</h4>
            <h2>{{ stats.scheduleCount }}</h2>
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MainLayout from "../components/layout/MainLayout.vue";
import { getCurrentUser } from "../services/authService";

const user = getCurrentUser();

// Data dummy sementara sebelum ada API
const stats = ref({
  usersCount: 0,
  guruCount: 0,
  studentCount: 0,
  subjectCount: 0,
  scheduleCount: 0,
  pendingJournalCount: 0,
});

// Nanti di Tahap 6 kita akan memanggil API disini
onMounted(() => {
  // Mock data stat
  stats.value = {
    usersCount: 5,
    guruCount: 3,
    studentCount: 15,
    subjectCount: 4,
    scheduleCount: 10,
    pendingJournalCount: 2,
  };
});
</script>
