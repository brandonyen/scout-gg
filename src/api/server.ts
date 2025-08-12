import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const RIOT_API_KEY = process.env.RIOT_API_KEY as string;

interface RiotParams {
  gamename?: string;
  tagline?: string;
  region?: string;
  platform?: string;
  puuid?: string;
  count?: string;
  matchid?: string;
}

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api/v1/userData", async (req, res) => {
  const { gamename, tagline, region } = req.query as RiotParams;

  if (!gamename || !tagline || !region) {
    res.status(400).json({ error: "Missing parameters!" });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gamename}/${tagline}`,
      {
        headers: {
          "X-RIOT-TOKEN": RIOT_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Riot API Error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/summonerData", async (req, res) => {
  const { puuid, platform } = req.query as RiotParams;

  if (!puuid || !platform) {
    res.status(400).json({ error: "Missing parameters!" });
  }

  try {
    const response = await axios.get(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          "X-RIOT-TOKEN": RIOT_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Riot API Error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/rankedData", async (req, res) => {
  const { puuid, platform } = req.query as RiotParams;

  if (!puuid || !platform) {
    res.status(400).json({ error: "Missing parameters!" });
  }

  try {
    const response = await axios.get(
      `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        headers: {
          "X-RIOT-TOKEN": RIOT_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Riot API Error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/matchList", async (req, res) => {
  const { puuid, count, region } = req.query as RiotParams;

  if (!puuid || !count || !region) {
    res.status(400).json({ error: "Missing parameters!" });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: {
          "X-RIOT-TOKEN": RIOT_API_KEY,
        },
        params: {
          count: count,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Riot API Error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/matchData", async (req, res) => {
  const { matchid, region } = req.query as RiotParams;

  if (!matchid || !region) {
    res.status(400).json({ error: "Missing parameters!" });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchid}`,
      {
        headers: {
          "X-RIOT-TOKEN": RIOT_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Riot API Error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
