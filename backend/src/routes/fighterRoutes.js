const express = require("express");
const router = express.Router();
const fighterController = require("../controllers/fighterController");

router.post("/", fighterController.createFighter);
router.get("/", fighterController.getAllFighters);

module.exports = router;