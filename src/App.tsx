import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [gameNameInput, setGameNameInput] = useState("");
  const [tagLineInput, setTagLineInput] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [summonerInfo, setSummonerInfo] = useState(null);
  const [matchList, setMatchList] = useState([]);
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
      setUserInfo(response.data);
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

  const fetchUserInfoPUUID = async (puuid: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/userInfoPUUID/" + puuid
      );
      return response.data;
    } catch (err) {
      setError("Failed to fetch user info");
      console.error(err);
    }
  };

  const fetchSummonerInfo = async (puuid: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/summonerInfo/" + puuid
      );
      setSummonerInfo(response.data);
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
      <div>
        <h2>User Info</h2>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userInfo && summonerInfo && (
        <div style={{ display: "flex" }}>
          <img
            src={
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/" +
              summonerInfo["profileIconId"] +
              ".png"
            }
            style={summonerIconStyle}
            alt="Summoner Icon"
          />
          <div>
            <h3>
              {userInfo["gameName"]}#{userInfo["tagLine"]}
            </h3>
            <p>
              <strong>Summoner Level: </strong> {summonerInfo["summonerLevel"]}
            </p>
          </div>
        </div>
      )}

      {matchList.length > 0 && (
        <div>
          <h2>Match List</h2>
          {matchList.map((matchId, index) => (
            <div key={index}>
              <h3>Match {index + 1}</h3>
              <p>
                <strong>Match ID: </strong> {matchId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
