import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

interface MatchInfo {
  gameType: string;
  winner: string;
  blueSummoners: SummonerInfo[];
  redSummoners: SummonerInfo[];
}

interface SummonerInfo {
  gameName: string;
  tagLine: string;
  champion: string;
  kills: bigint;
  deaths: bigint;
  assists: bigint;
}

interface RankedInfo {
  type: string;
  tier: string;
  rank: string;
  points: bigint;
}

function App() {
  const [gameNameInput, setGameNameInput] = useState("");
  const [tagLineInput, setTagLineInput] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [currentSummonerInfo, setCurrentSummonerInfo] = useState(null);
  const [currentRankedInfo, setCurrentRankedInfo] = useState<RankedInfo | null>(
    null
  );
  const [matchList, setMatchList] = useState<string[]>([]);
  const [matchInfoList, setMatchInfoList] = useState<MatchInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const summonerIconStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    marginRight: "20px",
  };

  const championIconStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    marginRight: "10px",
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

  const fetchSummonerRank = async (summonerId: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/rankedInfo/" + summonerId
      );
      let soloDuoRankedInfo: RankedInfo | null = null;
      let flexRankedInfo: RankedInfo | null = null;

      response.data.forEach((queueRank: any) => {
        if (queueRank["queueType"] == "RANKED_SOLO_5x5") {
          soloDuoRankedInfo = {
            type: "Ranked Solo/Duo",
            tier: queueRank["tier"],
            rank: queueRank["rank"],
            points: queueRank["leaguePoints"],
          };
        } else if (queueRank["queueType"] == "RANKED_FLEX_SR") {
          flexRankedInfo = {
            type: "Ranked Flex",
            tier: queueRank["tier"],
            rank: queueRank["rank"],
            points: queueRank["leaguePoints"],
          };
        }
      });

      if (soloDuoRankedInfo) {
        setCurrentRankedInfo(soloDuoRankedInfo);
      } else if (flexRankedInfo) {
        setCurrentRankedInfo(flexRankedInfo);
      }
    } catch (err) {
      setError("Failed to fetch ranked info");
      console.error(err);
    }
  };

  const handleFetchUserClick = async () => {
    setError(null);
    setCurrentUserInfo(null);
    setCurrentSummonerInfo(null);
    setCurrentRankedInfo(null);
    setMatchList([]);
    setMatchInfoList([]);

    try {
      const userInfo = await fetchUserInfo(gameNameInput, tagLineInput);
      if (!userInfo) return;

      const summonerInfo = await fetchSummonerInfo(userInfo.puuid);
      if (!summonerInfo) return;

      await fetchSummonerRank(summonerInfo.id);
      const matchList = await fetchMatchList(userInfo.puuid, "10");
      if (!matchList || matchList.length === 0) return;

      const matchDetailsList = await Promise.all(
        matchList.map(async (matchId: string) => {
          const details = await fetchMatchInfo(matchId);
          return details;
        })
      );

      if (matchDetailsList.length == 0) return;

      const matchInfoListTrimmed: MatchInfo[] = [];
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

        const blueSummonerInfo: SummonerInfo[] = [];
        const redSummonerInfo: SummonerInfo[] = [];

        matchDetails["info"]["participants"].forEach(
          (participant: any, index: bigint) => {
            const currentParticipant: SummonerInfo = {
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
          }
        );

        const matchInfoTrimmed: MatchInfo = {
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

      {currentUserInfo && currentSummonerInfo && currentRankedInfo && (
        <div>
          <div>
            <h2>User Info</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
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
              {currentRankedInfo ? (
                <p>
                  <strong>{currentRankedInfo.type}: </strong>
                  {currentRankedInfo.tier} {currentRankedInfo.rank}{" "}
                  {currentRankedInfo.points.toString()}LP
                </p>
              ) : (
                <p>There is no Ranked information available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {matchInfoList.length > 0 && (
        <div>
          <h2>Match List</h2>
          {matchInfoList.map((matchInfo, index) => {
            return (
              <div key={index}>
                <h3>Match {index + 1}</h3>
                <p>{matchInfo.gameType}</p>
                <p>Winner: {matchInfo.winner}</p>
                <div
                  className={matchInfo.winner == "Blue" ? "winner" : "loser"}
                  style={{
                    display: "flex",
                    padding: "20px",
                    alignItems: "center",
                  }}
                >
                  {matchInfo.winner == "Blue" ? (
                    <p>Victory (Blue Team)</p>
                  ) : (
                    <p>Defeat (Blue Team)</p>
                  )}
                  {matchInfo.blueSummoners.map((blueSummoner) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <img
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/" +
                            blueSummoner.champion +
                            ".png"
                          }
                          style={championIconStyle}
                          alt="Champion Icon"
                        />
                        <div>
                          <p>
                            {blueSummoner.gameName}#{blueSummoner.tagLine}
                          </p>
                          <p>
                            {blueSummoner.kills.toString()}/
                            {blueSummoner.deaths.toString()}/
                            {blueSummoner.assists.toString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className={matchInfo.winner == "Red" ? "winner" : "loser"}
                  style={{
                    display: "flex",
                    padding: "20px",
                    alignItems: "center",
                  }}
                >
                  {matchInfo.winner == "Red" ? (
                    <p>Victory (Red Team)</p>
                  ) : (
                    <p>Defeat (Red Team)</p>
                  )}
                  {matchInfo.redSummoners.map((redSummoner) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <img
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/" +
                            redSummoner.champion +
                            ".png"
                          }
                          style={championIconStyle}
                          alt="Champion Icon"
                        />
                        <div>
                          <p>
                            {redSummoner.gameName}#{redSummoner.tagLine}
                          </p>
                          <p>
                            {redSummoner.kills.toString()}/
                            {redSummoner.deaths.toString()}/
                            {redSummoner.assists.toString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
