import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require&channel_binding=require`,
});

// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// --------------------- PROBLEMS ROUTES ---------------------

// GET all problems
app.get("/api/problems", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problems ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching problems");
  }
});

// POST a new problem
app.post("/api/problems", async (req, res) => {
  const { title, description, budget, owner } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO problems (title, description, budget, owner, status, created_at)
       VALUES ($1, $2, $3, $4, 'open', NOW()) RETURNING *`,
      [title, description, budget, owner]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error creating problem");
  }
});

// GET a single problem by ID
app.get("/api/problems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM problems WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Problem not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching problem");
  }
});

// --------------------- END PROBLEMS ROUTES ---------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
