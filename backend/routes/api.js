const express = require("express");
const router = express.Router();

// --- MOCK DATABASE (Ganti dengan kueri database asli MySQL/PostgreSQL nanti) ---
let users = [];
let students = [];
let subjects = [];
let idCounter = 1;

// --- CRUD BIDANG LES ---
router.get("/subjects", (req, res) => res.json(subjects));
router.post("/subjects", (req, res) => {
  const newSubject = { id: idCounter++, ...req.body };
  subjects.push(newSubject);
  res.json(newSubject);
});
router.put("/subjects/:id", (req, res) => {
  const index = subjects.findIndex((s) => s.id === parseInt(req.params.id));
  subjects[index] = { ...subjects[index], ...req.body };
  res.json(subjects[index]);
});
router.delete("/subjects/:id", (req, res) => {
  subjects = subjects.filter((s) => s.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// --- CRUD SISWA ---
router.get("/students", (req, res) => res.json(students));
router.post("/students", (req, res) => {
  const newStudent = { id: idCounter++, ...req.body };
  students.push(newStudent);
  res.json(newStudent);
});
router.put("/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));
  students[index] = { ...students[index], ...req.body };
  res.json(students[index]);
});
router.delete("/students/:id", (req, res) => {
  students = students.filter((s) => s.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// --- CRUD USERS ---
router.get("/users", (req, res) => res.json(users));
router.post("/users", (req, res) => {
  const newUser = { id: idCounter++, ...req.body };
  users.push(newUser);
  res.json(newUser);
});
router.put("/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});
router.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ success: true });
});

module.exports = router;
