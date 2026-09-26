import { getCurrentUser } from "../services/authService";

const permissions = {
  admin: [
    "dashboard.view",
    "users.view",
    "students.view",
    "subjects.view",
    "schedule.view",
  ],
  pimpinan: ["dashboard.view", "schedule.view", "journal.review"],
  guru: ["dashboard.view", "schedule.view", "journal.create"],
};

export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;

  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes(permission);
};
