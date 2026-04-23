const express = require("express");
const cors = require("cors");
const fighterRoutes = require("./routes/fighterRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/fighters", fighterRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Backend API running" });
});

module.exports = app;