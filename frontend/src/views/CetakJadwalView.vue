<template>
  <div class="main-content" style="padding: 1.5rem; background: #fff">
    <!-- Tombol aksi saat di layar (tidak ikut tercetak) -->
    <div
      class="no-print"
      style="
        margin-bottom: 1.5rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      "
    >
      <button class="btn btn-primary" @click="triggerPrint">
        <i class="fas fa-print"></i> Cetak Sekarang
      </button>
      <button class="btn btn-secondary" @click="closePrint">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
    </div>

    <!-- Container Cetak Jadwal -->
    <div id="schedulePrintContainer">
      <div
        v-for="(day, dayIndex) in days"
        :key="day"
        class="day-print-block"
        :class="{ 'page-break': dayIndex < days.length - 1 }"
      >
        <div class="print-header">
          <h2>LKP SMART LEARNING CENTER</h2>
          <h3>JADWAL MENGAJAR HARI {{ day.toUpperCase() }}</h3>
        </div>

        <div class="table-responsive">
          <table class="table-print">
            <thead>
              <tr>
                <th style="width: 80px">Jam</th>
                <th v-for="t in teachers" :key="t.id">{{ t.alias }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in hours" :key="h">
                <td style="text-align: center">
                  <b>{{ h }}</b>
                </td>
                <td v-for="t in teachers" :key="t.id">
                  <template v-if="getScheduleItem(day, h, t.id)">
                    <strong>{{
                      getSubjectName(getScheduleItem(day, h, t.id).subjectId)
                    }}</strong>
                    <div
                      v-if="
                        getStudentNames(getScheduleItem(day, h, t.id)).length >
                        0
                      "
                      style="margin-top: 4px; font-size: 8.5pt"
                    >
                      <div
                        v-for="(sName, idx) in getStudentNames(
                          getScheduleItem(day, h, t.id),
                        )"
                        :key="idx"
                      >
                        {{ sName }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      style="color: #888; display: block; text-align: center"
                      >-</span
                    >
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api.js";

const router = useRouter();
const hours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const users = ref([]);
const schedules = ref([]);
const subjects = ref([]);
const students = ref([]);

const fetchData = async () => {
  try {
    const [uRes, scRes, sbRes, stRes] = await Promise.all([
      api.get("/users"),
      api.get("/schedules"),
      api.get("/subjects"),
      api.get("/students"),
    ]);
    users.value = uRes.data;
    schedules.value = scRes.data;
    subjects.value = sbRes.data;
    students.value = stRes.data;
  } catch (err) {
    console.error("Gagal memuat data cetak jadwal:", err);
  }
};

const teachers = computed(() => {
  return users.value.filter((u) => u.role === "guru" || u.role === "pimpinan");
});

const getScheduleItem = (day, hour, teacherId) => {
  return schedules.value.find(
    (s) =>
      s.day === day &&
      s.time === hour &&
      Number(s.teacherId) === Number(teacherId),
  );
};

const getSubjectName = (subjectId) => {
  const subj = subjects.value.find((sb) => Number(sb.id) === Number(subjectId));
  return subj ? subj.name : "Unknown";
};

const getStudentNames = (scheduleItem) => {
  if (!scheduleItem || !scheduleItem.students) return [];
  return scheduleItem.students
    .map((st) => {
      const sId = typeof st === "object" ? st.studentId : st;
      const stdObj = students.value.find((s) => Number(s.id) === Number(sId));
      return stdObj ? stdObj.name : null;
    })
    .filter(Boolean);
};

const triggerPrint = () => {
  window.print();
};

const closePrint = () => {
  router.push("/jadwal");
};

onMounted(() => {
  fetchData();
});
</script>
