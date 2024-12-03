import { useState } from "react";
import axios from "axios";

function App() {
  const [userData, setUserData] = useState(null);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/user/${gameName}/${tagLine}`
      );
      setUserData(response.data); // Set the data received
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

      {userData && (
        <div>
          <h2>User Info</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
