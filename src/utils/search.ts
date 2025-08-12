import { getMatchData, getMatchList } from "../api/match";
import { getUserData, getSummonerData, getRankedData } from "../api/user";
import { Routing } from "../interface/Routing";
import { compileMatchData } from "./match";

const searchUser = async (
  gameName: string,
  tagLine: string,
  routing: Routing
) => {
  const userData = (await getUserData(gameName, tagLine, routing.region)).data;
  const puuid = userData.puuid;
  const summonerData = (await getSummonerData(puuid, routing.platform)).data;
  const rankedData = (await getRankedData(puuid, routing.platform)).data;
  const matchList = (await getMatchList(puuid, "10", routing.region)).data;

  const matchDataList = await Promise.all(
    matchList.map(async (matchId: string) => {
      return await getMatchData(matchId, routing.region);
    })
  );

  const compiledMatchData = await compileMatchData(matchDataList, puuid);

  return {
    userData,
    summonerData,
    rankedData,
    compiledMatchData,
  };
};

export default searchUser;
