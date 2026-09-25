import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "../services/authService";
import UsersView from "../views/UsersView.vue";
import SiswaView from "../views/SiswaView.vue";
import BidangLesView from "../views/BidangLesView.vue";
import ScheduleView from "../views/ScheduleView.vue";
import JournalGuruView from "../views/JournalGuruView.vue";
import JournalPimpinanView from "../views/JournalPimpinanView.vue";
import CetakJadwalView from "../views/CetakJadwalView.vue";

const routes = [
  // Tambahkan redirect dari "/" agar langsung diarahkan ke "/login" atau "/dashboard"
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/users",
    name: "Users",
    component: UsersView,
  },
  {
    path: "/siswa",
    name: "Siswa",
    component: SiswaView,
  },
  {
    path: "/bidang-les",
    name: "BidangLes",
    component: BidangLesView,
  },
  {
    path: "/jadwal",
    name: "Jadwal",
    component: ScheduleView,
  },
  {
    path: "/isi-jurnal",
    name: "Isi Jurnal Mengajar",
    component: JournalGuruView,
  },
  {
    path: "/periksa-jurnal",
    name: "Periksa Jurnal",
    component: JournalPimpinanView,
  },
  {
    path: "/cetak-jadwal",
    name: "Cetak Jadwal",
    component: CetakJadwalView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Perbaikan Vue Router 4 (menghapus next() dan menggunakan return)
router.beforeEach((to, from) => {
  const user = getCurrentUser();

  if (to.meta.requiresAuth && !user) {
    return "/login"; // Jika belum login dan akses halaman private, arahkan ke login
  }

  if (to.path === "/login" && user) {
    return "/dashboard"; // Jika sudah login dan akses halaman login, arahkan ke dashboard
  }

  return true; // Izinkan akses
});

export default router;
