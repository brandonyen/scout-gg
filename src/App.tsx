import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [gameNameInput, setGameNameInput] = useState("");
  const [tagLineInput, setTagLineInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [matchList, setMatchList] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async (gameName: string, tagLine: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/userInfo/" + gameName + "/" + tagLine
      );
      setUserData(response.data);
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
      setMatchInfo(response.data);
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
      setMatchInfo(response.data);
    } catch (err) {
      setError("Failed to fetch match info");
      console.error(err);
    }
  };

  const handleFetchUserClick = async () => {
    setError(null);

    try {
      const userInfo = await fetchUserInfo(gameNameInput, tagLineInput);
      if (!userInfo) return;

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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div>
          <h2>User Info</h2>
          <p>
            <strong>Username: </strong> {userData["gameName"]}#
            {userData["tagLine"]}
          </p>
          <p>
            <strong>Player UUID: </strong> {userData["puuid"]}
          </p>
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
