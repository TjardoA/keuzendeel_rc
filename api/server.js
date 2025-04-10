const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`https://api.deezer.com/search?q=${q}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
