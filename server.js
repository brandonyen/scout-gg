import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
const PORT = 3001;

import dotenv from "dotenv";
dotenv.config();
const RIOT_API_KEY = process.env.REACT_APP_RIOT_API_KEY;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Endpoint to search for user by gameName and tagLine
app.get("/api/user/:gameName/:tagLine", async (req, res) => {
  const { gameName, tagLine } = req.params;

  if (!gameName || !tagLine) {
    return res
      .status(400)
      .json({ error: "Both gameName and tagLine are required" });
  }

  try {
    const searchResponse = await axios.get(
      "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" +
        gameName +
        "/" +
        tagLine,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );
    const userData = searchResponse.data;
    res.json(userData);
  } catch (error) {
    if (error.response) {
      console.error("Riot API Error:", error.response.data); // Log full response data
      res.status(500).json({
        error: "Riot API responded with an error",
        details: error.response.data,
      });
    } else {
      console.error("Error in Axios request:", error.message); // Log network or other issues
      res.status(500).json({
        error: "Failed to fetch user data from Riot API",
        details: error.message,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
