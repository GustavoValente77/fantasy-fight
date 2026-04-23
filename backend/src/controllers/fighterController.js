const fighterService = require("../services/fighterService");

exports.createFighter = async (req, res) => {
    try {
        const fighter = await fighterService.createFighter(req.body);
        res.status(201).json(fighter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFighters = async (req, res) => {
    try {
        const fighters = await fighterService.getAllFighters();
        res.status(200).json(fighters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};