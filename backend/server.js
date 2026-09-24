const express = require("express");
const cors = require("cors");
const BaseRepository = require("./repositories/baseRepository");

const app = express();
app.use(cors());
app.use(express.json());

const userRepo = new BaseRepository("users");

// Simple Auth Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const users = userRepo.getAll();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
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

app.listen(3000, () => console.log("Backend berjalan di port 3000"));
