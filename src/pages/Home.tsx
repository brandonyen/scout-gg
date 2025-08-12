import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { RiotRankedData } from "../interface/Riot/RiotRankedData";
import { Routing } from "../interface/Routing";
import searchUser from "../utils/search";
import SummonerProfile, {
  SummonerProfileProps,
} from "../components/SummonerProfile";
import { getLatestDDVersion } from "../api/ddragon";
import { MatchData } from "../interface/MatchData";
import MatchTable from "../components/MatchTable";

const Home = () => {
  const [currentSummonerData, setCurrentSummonerData] =
    useState<SummonerProfileProps | null>(null);
  const [ddVersion, setDDVersion] = useState<string>();
  const [currentMatchData, setCurrentMatchData] = useState<MatchData[] | null>(
    null
  );
  const [currentRouting, setCurrentRouting] = useState<Routing>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getVersionOnLoad = async () => {
      const latestVersion = await getLatestDDVersion();
      setDDVersion(latestVersion);
    };

    getVersionOnLoad();
  }, []);

  const handleSearch = async (
    gameName: string,
    tagLine: string,
    routing: Routing
  ) => {
    setCurrentSummonerData(null);
    setCurrentMatchData(null);
    setError("");

    try {
      const response = await searchUser(gameName, tagLine, routing);

      let rankedData: RiotRankedData | null = null;

      if (response.rankedData.length > 0) {
        for (const queueData of response.rankedData) {
          if (queueData.queueType === "RANKED_SOLO_5x5") {
            rankedData = {
              ...queueData,
              queueType: "Ranked Solo/Duo",
            };
          } else if (queueData.queueType === "RANKED_FLEX_SR") {
            rankedData = {
              ...queueData,
              queueType: "Ranked Flex",
            };
          }
        }
      }

      setCurrentSummonerData({
        profileIconId: response.summonerData.profileIconId,
        gameName: response.userData.gameName,
        tagLine: response.userData.tagLine,
        summonerLevel: response.summonerData.summonerLevel,
        rankedData: rankedData,
      });
      setCurrentMatchData(response.compiledMatchData);
      setCurrentRouting(routing);
    } catch (error) {
      setError("An error occurred while searching for the user.");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar handleSearch={handleSearch} />
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex justify-center">
        <div className="w-160 mt-12">
          {currentSummonerData && (
            <SummonerProfile {...currentSummonerData} ddVersion={ddVersion!} />
          )}
          {currentMatchData && (
            <div className="flex flex-col gap-4 mt-4">
              {currentMatchData.map((matchData, index) => {
                return (
                  <MatchTable
                    matchData={matchData}
                    ddVersion={ddVersion!}
                    key={index}
                    handleSearch={(gameName: string, tagLine: string) =>
                      handleSearch(gameName, tagLine, currentRouting!)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
