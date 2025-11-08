import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors({
  origin: ["https://icaroaugusto137.github.io"],
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ✅ Criação do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000
});

// ✅ Endpoint principal
app.get("/", (req, res) => {
  res.json({ status: "API Café do Bairro rodando ☕" });
});

// ✅ Endpoint para listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM produtos WHERE ativo = 1");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao carregar produtos" });
  }
});

// ✅ Endpoint para cadastrar clientes
app.post("/clientes", async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    const [result] = await pool.query(
      "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)",
      [nome, telefone, email]
    );
    res.json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

// ✅ Porta Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
