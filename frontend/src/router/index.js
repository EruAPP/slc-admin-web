import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "../services/authService";

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = getCurrentUser();
  if (to.meta.requiresAuth && !user) next("/login");
  else if (to.path === "/login" && user) next("/dashboard");
  else next();
});

export default router;
