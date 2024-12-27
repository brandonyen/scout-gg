import { useState, useEffect } from "react";
import axios from "axios";

interface matchInfo {
  gameType: string;
  winner: string;
  blueSummoners: summonerInfo[];
  redSummoners: summonerInfo[];
}

interface summonerInfo {
  gameName: string;
  tagLine: string;
  champion: string;
  kills: bigint;
  deaths: bigint;
  assists: bigint;
}

function App() {
  const [gameNameInput, setGameNameInput] = useState("");
  const [tagLineInput, setTagLineInput] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [currentSummonerInfo, setCurrentSummonerInfo] = useState(null);
  const [matchList, setMatchList] = useState<string[]>([]);
  const [matchInfoList, setMatchInfoList] = useState<matchInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const summonerIconStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    marginRight: "20px",
  };

  const fetchUserInfo = async (gameName: string, tagLine: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/userInfo/" + gameName + "/" + tagLine
      );
      setCurrentUserInfo(response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    }
  };

  const fetchMatchList = async (puuid: string, count: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/matchList/" + puuid + "/" + count
      );
      setMatchList(response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch match list");
      console.error(err);
    }
  };

  const fetchMatchInfo = async (matchId: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/matchInfo/" + matchId
      );
      return response.data;
    } catch (err) {
      setError("Failed to fetch match info");
      console.error(err);
    }
  };

  const fetchSummonerInfo = async (puuid: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/summonerInfo/" + puuid
      );
      setCurrentSummonerInfo(response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch summoner info");
      console.error(err);
    }
  };

  const handleFetchUserClick = async () => {
    setError(null);

    try {
      const userInfo = await fetchUserInfo(gameNameInput, tagLineInput);
      if (!userInfo) return;

      await fetchSummonerInfo(userInfo.puuid);
      const matchList = await fetchMatchList(userInfo.puuid, "5");
      if (!matchList || matchList.length === 0) return;

      const matchDetailsList = await Promise.all(
        matchList.map(async (matchId) => {
          const details = await fetchMatchInfo(matchId);
          return details;
        })
      );

      if (matchDetailsList.length == 0) return;

      const matchInfoListTrimmed: matchInfo[] = [];
      matchDetailsList.forEach((matchDetails) => {
        let winningSide: string;
        let queueMode: string;

        if (matchDetails["info"]["participants"][0]["win"]) {
          winningSide = "Blue";
        } else {
          winningSide = "Red";
        }

        const queueId = matchDetails["info"]["queueId"];

        switch (queueId) {
          case 400:
            queueMode = "Normal Draft";
            break;
          case 420:
            queueMode = "Ranked Solo/Duo";
            break;
          case 440:
            queueMode = "Ranked Flex";
            break;
          case 450:
            queueMode = "ARAM";
            break;
          case 490:
            queueMode = "Quickplay";
            break;
          default:
            queueMode = "Custom or RGM";
            break;
        }

        const blueSummonerInfo: summonerInfo[] = [];
        const redSummonerInfo: summonerInfo[] = [];

        matchDetails["info"]["participants"].forEach((participant, index) => {
          const currentParticipant: summonerInfo = {
            gameName: participant["riotIdGameName"],
            tagLine: participant["riotIdTagline"],
            champion: participant["championName"],
            kills: participant["kills"],
            deaths: participant["deaths"],
            assists: participant["assists"],
          };

          if (index < 5) {
            blueSummonerInfo.push(currentParticipant);
          } else {
            redSummonerInfo.push(currentParticipant);
          }
        });

        const matchInfoTrimmed: matchInfo = {
          gameType: queueMode,
          winner: winningSide,
          blueSummoners: blueSummonerInfo,
          redSummoners: redSummonerInfo,
        };
        matchInfoListTrimmed.push(matchInfoTrimmed);
      });

      setMatchInfoList(matchInfoListTrimmed);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Game Name"
        value={gameNameInput}
        onChange={(e) => setGameNameInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Tagline"
        value={tagLineInput}
        onChange={(e) => setTagLineInput(e.target.value)}
      />
      <button onClick={handleFetchUserClick}>Fetch User</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {currentUserInfo && currentSummonerInfo && (
        <div>
          <div>
            <h2>User Info</h2>
          </div>
          <div style={{ display: "flex" }}>
            <img
              src={
                "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/" +
                currentSummonerInfo["profileIconId"] +
                ".png"
              }
              style={summonerIconStyle}
              alt="Summoner Icon"
            />
            <div>
              <h3>
                {currentUserInfo["gameName"]}#{currentUserInfo["tagLine"]}
              </h3>
              <p>
                <strong>Summoner Level: </strong>{" "}
                {currentSummonerInfo["summonerLevel"]}
              </p>
            </div>
          </div>
        </div>
      )}

      {matchList.length > 0 && (
        <div>
          <h2>Match List</h2>
          {matchList.map((matchId, index) => {
            return (
              <div key={index}>
                <h3>Match {index + 1}</h3>
                <p>
                  <strong>Match ID: </strong> {matchId}
                  {JSON.stringify(matchInfoList[index], null, 2)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
