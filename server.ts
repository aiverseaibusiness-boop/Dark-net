import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("earning_app.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    dob TEXT,
    age INTEGER,
    profile_pic TEXT,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    points INTEGER DEFAULT 0,
    has_completed_tasks INTEGER DEFAULT 0,
    has_seen_onboarding INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    amount REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS redeem_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    method TEXT,
    details TEXT,
    amount REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Migrations: Ensure new columns exist in users table
const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
const columnNames = columns.map(c => c.name);

if (!columnNames.includes("has_completed_tasks")) {
  db.exec("ALTER TABLE users ADD COLUMN has_completed_tasks INTEGER DEFAULT 0");
}
if (!columnNames.includes("has_seen_onboarding")) {
  db.exec("ALTER TABLE users ADD COLUMN has_seen_onboarding INTEGER DEFAULT 0");
}
if (!columnNames.includes("membership_expires_at")) {
  db.exec("ALTER TABLE users ADD COLUMN membership_expires_at DATETIME DEFAULT NULL");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // --- API Routes ---

  // Auth
  app.get("/api/user/by-email/:email", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.params.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    
    // First try to find existing user with this email
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    
    if (user) {
      // If user exists, log them in
      res.json({ success: true, user });
    } else {
      // If user doesn't exist, return error
      res.status(404).json({ success: false, error: "Account is not available" });
    }
  });

  app.post("/api/user/profile", (req, res) => {
    const { userId, name, dob, age, profilePic } = req.body;
    db.prepare("UPDATE users SET name = ?, dob = ?, age = ?, profile_pic = ? WHERE id = ?").run(name, dob, age, profilePic, userId);
    res.json({ success: true });
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/user/complete-tasks", (req, res) => {
    const { userId } = req.body;
    db.prepare("UPDATE users SET has_completed_tasks = 1 WHERE id = ?").run(userId);
    res.json({ success: true });
  });

  app.post("/api/user/complete-onboarding", (req, res) => {
    const { userId } = req.body;
    db.prepare("UPDATE users SET has_seen_onboarding = 1 WHERE id = ?").run(userId);
    res.json({ success: true });
  });

  app.post("/api/user/membership", (req, res) => {
    const { userId, days } = req.body;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE users SET membership_expires_at = ? WHERE id = ?").run(expiresAt, userId);
    res.json({ success: true, expiresAt });
  });

  app.post("/api/user/membership/scan", (req, res) => {
    const { userId, token } = req.body;
    // Assuming token format: "DAYS_X" where X is number of days
    const match = token.match(/^DAYS_(\d+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const days = parseInt(match[1]);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE users SET membership_expires_at = ? WHERE id = ?").run(expiresAt, userId);
    res.json({ success: true, expiresAt });
  });

  // Earnings
  app.post("/api/earn/data", (req, res) => {
    const { userId, amountInr, description } = req.body;
    const points = Math.floor(amountInr * 1000);
    db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(points, userId);
    db.prepare("INSERT INTO history (user_id, type, amount, description) VALUES (?, 'Data', ?, ?)").run(userId, amountInr, description);
    res.json({ success: true });
  });

  // Stats
  app.get("/api/user/activity/:userId", (req, res) => {
    try {
      const userId = req.params.userId;
      const user = db.prepare("SELECT referral_code FROM users WHERE id = ?").get(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const referralCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE referred_by = ?").get(user.referral_code).count;
      
      // Today's points (sum of positive amounts in history for today)
      const today = new Date().toISOString().split('T')[0];
      const todayPoints = db.prepare("SELECT SUM(amount) as total FROM history WHERE user_id = ? AND amount > 0 AND created_at >= ?").get(userId, today).total || 0;

      res.json({ referralCount, todayPoints: Math.round(todayPoints * 1000) });
    } catch (error) {
      console.error("Error in /api/user/activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // History
  app.get("/api/history/:userId", (req, res) => {
    const history = db.prepare("SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(history);
  });

  // Redeem
  app.post("/api/redeem", (req, res) => {
    const { userId, method, details, amount } = req.body;
    const user = db.prepare("SELECT points FROM users WHERE id = ?").get(userId);
    const requiredPoints = amount * 1000;

    if (user.points < requiredPoints) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    db.prepare("UPDATE users SET points = points - ? WHERE id = ?").run(requiredPoints, userId);
    db.prepare("INSERT INTO redeem_requests (user_id, method, details, amount) VALUES (?, ?, ?, ?)").run(userId, method, details, amount);
    db.prepare("INSERT INTO history (user_id, type, amount, description) VALUES (?, 'Withdraw', ?, ?)").run(userId, -amount, `Withdrawal request: ${method}`);
    
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
