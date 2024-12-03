import { useState } from "react";
import axios from "axios";

function App() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [userData, setUserData] = useState(null);
  const [matchList, setMatchList] = useState(null);
  const [currMatchId, setCurrMatchId] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/userInfo/" + gameName + "/" + tagLine
      );
      setUserData(response.data);
      fetchMatchList(response.data["puuid"]);
    } catch (error) {
      console.error("There was an error!", error);
      // Optionally handle error
    }
  };

  const fetchMatchList = async (puuid: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/matchList/" + puuid
      );
      setMatchList(response.data);
      setCurrMatchId(response.data[0]);
      fetchMatchInfo(response.data[0]);
    } catch (error) {
      console.error("There was an error!", error);
      // Optionally handle error
    }
  };

  const fetchMatchInfo = async (matchId: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/matchInfo/" + matchId
      );
      setMatchInfo(response.data);
    } catch (error) {
      console.error("There was an error!", error);
      // Optionally handle error
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Game Name"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Tagline"
        value={tagLine}
        onChange={(e) => setTagLine(e.target.value)}
      />
      <button onClick={fetchUserData}>Fetch User</button>

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
            {JSON.stringify(matchInfo["metadata"]["participants"], null, 2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
