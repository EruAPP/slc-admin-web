const express = require("express");
const cors = require("cors");

// Import repository spesifik
const userRepository = require("./repositories/userRepository");
const studentRepository = require("./repositories/studentRepository");
const subjectRepository = require("./repositories/subjectRepository");
const scheduleRepository = require("./repositories/scheduleRepository");

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH LOGIN ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = userRepository.findByUsername(username);

  if (user && user.password === password) {
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `dummy-token-${user.id}`,
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Username atau password salah" });
  }
});

// --- CRUD USERS ---
app.get("/api/users", (req, res) => res.json(userRepository.getAll()));
app.post("/api/users", (req, res) => {
  // Cek username duplikat
  const existing = userRepository.findByUsername(req.body.username);
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Username sudah digunakan" });
  }
  const newUser = userRepository.create(req.body);
  res.json(newUser);
});
app.put("/api/users/:id", (req, res) => {
  const updatedUser = userRepository.update(req.params.id, req.body);
  res.json(updatedUser);
});
app.delete("/api/users/:id", (req, res) => {
  const success = userRepository.delete(req.params.id);
  res.json({ success });
});

// --- CRUD STUDENTS ---
app.get("/api/students", (req, res) => res.json(studentRepository.getAll()));
app.post("/api/students", (req, res) => {
  const newStudent = studentRepository.create(req.body);
  res.json(newStudent);
});
app.put("/api/students/:id", (req, res) => {
  const updatedStudent = studentRepository.update(req.params.id, req.body);
  res.json(updatedStudent);
});
app.delete("/api/students/:id", (req, res) => {
  const success = studentRepository.delete(req.params.id);
  res.json({ success });
});

// --- CRUD SUBJECTS ---
app.get("/api/subjects", (req, res) => res.json(subjectRepository.getAll()));
app.post("/api/subjects", (req, res) => {
  const newSubject = subjectRepository.create(req.body);
  res.json(newSubject);
});
app.put("/api/subjects/:id", (req, res) => {
  const updatedSubject = subjectRepository.update(req.params.id, req.body);
  res.json(updatedSubject);
});
app.delete("/api/subjects/:id", (req, res) => {
  const success = subjectRepository.delete(req.params.id);
  res.json({ success });
});

// JADWAL
app.get("/api/schedules", (req, res) => res.json(scheduleRepository.getAll()));
app.post("/api/schedules", (req, res) => {
  const newSchedule = scheduleRepository.create(req.body);
  res.json(newSchedule);
});
app.put("/api/schedules/:id", (req, res) => {
  const updated = scheduleRepository.update(req.params.id, req.body);
  res.json(updated);
});
app.delete("/api/schedules/:id", (req, res) => {
  const success = scheduleRepository.delete(req.params.id);
  res.json({ success });
});

app.listen(3000, () => console.log("Backend berjalan di port 3000"));
