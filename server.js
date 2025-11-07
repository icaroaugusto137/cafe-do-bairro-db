import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error("❌ Erro ao conectar ao banco:", err);
  else console.log("✅ Conexão com o banco estabelecida!");
});

app.get("/", (req, res) => res.json({ status: "API Café do Bairro rodando ☕" }));

app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM produtos WHERE ativo = 1", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/clientes", (req, res) => {
  const { nome, telefone, email } = req.body;
  const sql = "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)";
  db.query(sql, [nome, telefone, email], (err, result) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, id: result.insertId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));