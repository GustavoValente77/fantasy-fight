const mongoose = require("mongoose");

const FighterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weightClass: { type: String, required: true },
    ranking: { type: String, required: true },
    nickname: String,
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Fighter", FighterSchema);
