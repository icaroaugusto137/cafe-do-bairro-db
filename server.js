import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Função de reconexão automática ao MySQL
let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
  });

  db.connect((err) => {
    if (err) {
      console.error("❌ Erro ao conectar ao banco:", err);
      setTimeout(handleDisconnect, 5000); // tenta reconectar após 5s
    } else {
      console.log("✅ Conexão com o banco estabelecida!");
    }
  });

  db.on("error", (err) => {
    console.error("⚠️ Erro na conexão com o banco:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      handleDisconnect(); // reconecta automaticamente
    }
  });
}

handleDisconnect();

// Rota principal
app.get("/", (req, res) => res.json({ status: "API Café do Bairro rodando ☕" }));

// Listar produtos
app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM produtos WHERE ativo = 1", (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
    res.json(results);
  });
});

// Cadastrar cliente
app.post("/clientes", (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome || !email)
    return res.status(400).json({ ok: false, error: "Nome e e-mail são obrigatórios." });

  const sql = "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)";
  db.query(sql, [nome, telefone, email], (err, result) => {
    if (err) {
      console.error("Erro ao inserir cliente:", err);
      return res.status(500).json({ ok: false, error: "Erro ao inserir cliente." });
    }
    res.json({ ok: true, id: result.insertId });
  });
});

// Listar clientes (opcional)
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes ORDER BY criado_em DESC", (err, results) => {
    if (err) {
      console.error("Erro ao buscar clientes:", err);
      return res.status(500).json({ error: "Erro ao buscar clientes" });
    }
    res.json(results);
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
