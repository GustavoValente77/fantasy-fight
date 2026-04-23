require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Fighter = require("./models/Fighter");
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   ROTAS DA API
============================ */

app.get("/api/sincronizar-card", async (req, res) => {
  try {
    const atletas = await Fighter.find();
    res.json(atletas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.use('/api/auth', authRoutes);

/* ============================
   SERVIR ANGULAR (PRODUÇÃO)
============================ */

const angularPath = path.join(__dirname, "dist/fantasy");

app.use(express.static(angularPath));

/* ============================
   FALLBACK
============================ */

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

/* ============================
   BANCO + SERVER
============================ */

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(3000, () => {
      console.log("Servidor ON: http://localhost:3000");
    });
  })
  .catch(err => {
    console.error("Erro ao conectar no MongoDB:", err);
  });