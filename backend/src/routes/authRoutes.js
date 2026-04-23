const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    const userExist = await User.findOne({ nome });
    if (userExist) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    const user = new User({ nome, senha });
    await user.save();

    res.json({
      user: {
        nome: user.nome
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const user = await User.findOne({ nome, senha });

    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    res.json({
      user: {
        nome: user.nome
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

module.exports = router;