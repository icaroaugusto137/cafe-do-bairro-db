import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

// 🔒 Configuração de CORS (libera apenas seu domínio GitHub Pages)
app.use(cors({
  origin: ["https://icaroaugusto137.github.io"],
  methods: ["GET", "POST"],
}));

// Função auxiliar para logar com timestamp
function log(msg, type = "INFO") {
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  console.log(`[${now}] [${type}] ${msg}`);
}

// =============================
// 🔄 Conexão MySQL com reconexão automática
// =============================

let pool;

async function connectDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 15000
    });

    const [rows] = await pool.query("SELECT 1");
    log("✅ Conexão com MySQL estabelecida com sucesso!");
    return pool;
  } catch (err) {
    log(`❌ Falha na conexão MySQL: ${err.code || err.message}`, "ERROR");
    log("⏳ Tentando reconectar em 5 segundos...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB();
  }
}

await connectDB();

// =============================
// 🛠️ Middleware de verificação da conexão
// =============================

app.use(async (req, res, next) => {
  try {
    const [ping] = await pool.query("SELECT 1");
    next();
  } catch (error) {
    log("⚠️ Conexão perdida, tentando reconectar...", "WARN");
    await connectDB();
    next();
  }
});

// =============================
// 🌐 Rotas da API
// =============================

// Teste simples de status
app.get("/", (req, res) => {
  res.json({ status: "API Café do Bairro rodando ☕", uptime: process.uptime().toFixed(0) + "s" });
});

// Endpoint de produtos
app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM produtos WHERE ativo = 1");
    res.json(rows);
  } catch (error) {
    log(`Erro ao buscar produtos: ${error.message}`, "ERROR");
    res.status(500).json({ error: "Erro ao carregar produtos" });
  }
});

// Endpoint para cadastrar clientes
app.post("/clientes", async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: "Campos obrigatórios: nome e email." });
    }

    const [result] = await pool.query(
      "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)",
      [nome, telefone || null, email]
    );

    log(`🧾 Novo cliente cadastrado: ${nome} (${email})`);
    res.json({ ok: true, id: result.insertId });
  } catch (error) {
    log(`Erro ao cadastrar cliente: ${error.message}`, "ERROR");
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

// Endpoint para listar clientes (opcional)
app.get("/clientes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes ORDER BY id DESC LIMIT 20");
    res.json(rows);
  } catch (error) {
    log(`Erro ao buscar clientes: ${error.message}`, "ERROR");
    res.status(500).json({ error: "Erro ao carregar clientes" });
  }
});

// =============================
// 🚀 Inicialização do servidor
// =============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`🚀 Servidor rodando na porta ${PORT}`);
});
