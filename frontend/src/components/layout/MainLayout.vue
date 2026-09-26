<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="sidebar-header">
        <div class="brand-logo">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="brand-title">
          <h3>SLC ADMIN</h3>
          <small>Smart Learning Center</small>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Gunakan router-link agar pindah halaman tanpa reload -->
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i class="fas" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
      <header class="topbar">
        <button class="btn-toggle-sidebar" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="topbar-right" style="margin-left: auto">
          <div class="user-profile-info">
            <span class="user-name">{{ user?.name }}</span>
            <span class="badge" :class="roleBadgeClass">{{
              user?.role.toUpperCase()
            }}</span>
          </div>
          <button class="btn-logout" @click="handleLogout" title="Keluar">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <!-- Slot Content -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>

    <!-- Backdrop untuk mobile (opsional) -->
    <div
      v-if="isSidebarOpen"
      class="modal-backdrop active"
      style="z-index: 90"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser, logout } from "../../services/authService";

const router = useRouter();
const user = getCurrentUser();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    logout();
    router.push("/login");
  }
};

// Menentukan warna badge berdasarkan role
const roleBadgeClass = computed(() => {
  const badges = {
    admin: "badge-danger",
    pimpinan: "badge-warning",
    guru: "badge-primary",
  };
  return badges[user?.role] || "badge-secondary";
});

// Menentukan menu sidebar berdasarkan role (mirip dengan layout.js Anda)
const menuItems = computed(() => {
  const role = user?.role;
  const menus = {
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fa-chart-line",
        path: "/dashboard",
      },
      {
        id: "jadwal",
        label: "Jadwal",
        icon: "fa-calendar-alt",
        path: "/jadwal",
      },
      {
        id: "siswa",
        label: "Siswa",
        icon: "fa-user-graduates",
        path: "/siswa",
      },
      {
        id: "bidang-les",
        label: "Bidang Les",
        icon: "fa-book-open",
        path: "/bidang-les",
      },
      {
        id: "users",
        label: "Tambah User",
        icon: "fa-user-plus",
        path: "/users",
      },
      {
        id: "reset-password",
        label: "Reset Password",
        icon: "fa-key",
        path: "/reset-password",
      },
      { id: "profil", label: "Profil", icon: "fa-user-cog", path: "/profil" },
    ],
    pimpinan: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fa-chart-line",
        path: "/dashboard",
      },
      {
        id: "jadwal",
        label: "Jadwal",
        icon: "fa-calendar-alt",
        path: "/jadwal",
      },
      {
        id: "isi-jurnal",
        label: "Isi Jurnal",
        icon: "fa-edit",
        path: "/isi-jurnal",
      },
      {
        id: "periksa-jurnal",
        label: "Periksa Jurnal",
        icon: "fa-tasks",
        path: "/periksa-jurnal",
      },
      {
        id: "laporan-jurnal",
        label: "Laporan Jurnal",
        icon: "fa-file-alt",
        path: "/laporan-jurnal",
      },
      { id: "profil", label: "Profil", icon: "fa-user-cog", path: "/profil" },
    ],
    guru: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fa-chart-line",
        path: "/dashboard",
      },
      {
        id: "jadwal",
        label: "Jadwal",
        icon: "fa-calendar-alt",
        path: "/jadwal",
      },
      {
        id: "isi-jurnal",
        label: "Isi Jurnal",
        icon: "fa-edit",
        path: "/isi-jurnal",
      },
      { id: "profil", label: "Profil", icon: "fa-user-cog", path: "/profil" },
      {
        id: "laporan-jurnal",
        label: "Laporan Jurnal",
        icon: "fa-file-alt",
        path: "/laporan-jurnal",
      },
    ],
  };
  return menus[role] || [];
});
</script>
