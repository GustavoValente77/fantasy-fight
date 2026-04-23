const mongoose = require("mongoose");

const FighterSchema = new mongoose.Schema({
  name: String,
  weightClass: String,
  ranking: String,
  active: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Fighter", FighterSchema);