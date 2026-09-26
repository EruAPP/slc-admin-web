const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Import repository spesifik
const userRepository = require("./repositories/userRepository");
const studentRepository = require("./repositories/studentRepository");
const subjectRepository = require("./repositories/subjectRepository");
const scheduleRepository = require("./repositories/scheduleRepository");
const journalRepository = require("./repositories/journalRepository");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- AUTH LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        user: userWithoutPassword,
        token: `id-token-${user.id}`,
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "Username atau password salah" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
    });
  }
});

// --- CRUD USERS ---
app.get("/api/users", async (req, res) => {
  try {
    const users = await userRepository.getAll();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data user" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const existing = await userRepository.findByUsername(req.body.username);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Username sudah digunakan" });
    }
    const userData = { ...req.body };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const newUser = await userRepository.create(req.body);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Jika password kosong/hanya spasi, hapus dari updateData agar password lama tetap terjaga
    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await userRepository.update(req.params.id, updateData);
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const success = await userRepository.delete(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CRUD STUDENTS ---
app.get("/api/students", async (req, res) => {
  try {
    const data = await studentRepository.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await studentRepository.create(req.body);
    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await studentRepository.update(
      req.params.id,
      req.body,
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const success = await studentRepository.delete(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CRUD SUBJECTS ---
app.get("/api/subjects", async (req, res) => {
  try {
    const data = await subjectRepository.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const newSubject = await subjectRepository.create(req.body);
    res.json(newSubject);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/subjects/:id", async (req, res) => {
  try {
    const updatedSubject = await subjectRepository.update(
      req.params.id,
      req.body,
    );
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const success = await subjectRepository.delete(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- JADWAL ---
app.get("/api/schedules", async (req, res) => {
  try {
    const data = await scheduleRepository.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/schedules", async (req, res) => {
  try {
    const newSchedule = await scheduleRepository.create(req.body);
    res.json(newSchedule);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/schedules/:id", async (req, res) => {
  try {
    const updated = await scheduleRepository.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/schedules/:id", async (req, res) => {
  try {
    const success = await scheduleRepository.delete(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- JOURNAL ---
app.get("/api/journals", async (req, res) => {
  try {
    const data = await journalRepository.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/journals", async (req, res) => {
  try {
    const newJournal = await journalRepository.create(req.body);
    res.json(newJournal);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/journals/:id", async (req, res) => {
  try {
    const updated = await journalRepository.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/journals/:id", async (req, res) => {
  try {
    const success = await journalRepository.delete(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend SLCDM menyala dan Firebase terhubung.",
  });
});

app.listen(3000, () => console.log("Backend berjalan di port 3000"));
