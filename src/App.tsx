import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [gameNameInput, setGameNameInput] = useState("");
  const [tagLineInput, setTagLineInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [matchList, setMatchList] = useState(null);
  const [currMatchId, setCurrMatchId] = useState("");
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

  const fetchMatchList = async (puuid: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/matchList/" + puuid
      );
      setMatchList(response.data);
      setCurrMatchId(response.data[0]);
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
    } catch (err) {
      setError("Failed to fetch match info");
      console.error(err);
    }
  };

  const handleFetchUserClick = async () => {
    setError(null);

    try {
      // Fetch user info
      const userInfo = await fetchUserInfo(gameNameInput, tagLineInput);
      if (!userInfo) return;

      // Fetch match list with userInfo.puuid
      const matchList = await fetchMatchList(userInfo.puuid);
      if (!matchList || matchList.length === 0) return;

      // Fetch match info with the first match ID
      await fetchMatchInfo(matchList[0]);
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

      {userData && matchInfo && (
        <div>
          <h2>User Info</h2>
          <p>
            <strong>Username: </strong> {userData["gameName"]}#
            {userData["tagLine"]}
          </p>
          <p>
            <strong>Player UUID: </strong> {userData["puuid"]}
          </p>
          <p>
            <strong>Most Recent Match ID: </strong> {currMatchId}
          </p>
          <p>
            <strong>Most Recent Match Info: </strong>{" "}
            {JSON.stringify(
              matchInfo["info"]["participants"][9]["championName"],
              null,
              2
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
