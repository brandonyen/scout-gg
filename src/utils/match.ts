import { MatchData } from "../interface/MatchData";
import { RiotMatchData } from "../interface/Riot/RiotMatchData";
import { RiotSummonerMatchData } from "../interface/Riot/RiotSummonerMatchData";
import { SummonerMatchData } from "../interface/SummonerMatchData";
import getQueueMode from "./queue";

export const compileMatchData = async (
  riotMatchDataList: RiotMatchData[],
  puuid: string
) => {
  const matchDataList: MatchData[] = [];
  riotMatchDataList
    .filter(
      (match: RiotMatchData) =>
        match.participants.length == 10 &&
        match.endOfGameResult == "GameComplete"
    )
    .forEach((matchData) => {
      let winningSide: "Blue" | "Red";
      let currentSummonerMatchData: SummonerMatchData;
      let currentSummonerDidWin: boolean;

      if (matchData.participants[0].win) {
        winningSide = "Blue";
      } else {
        winningSide = "Red";
      }

      const queueMode = getQueueMode(matchData.queueId);

      const blueSummonerInfo: SummonerMatchData[] = [];
      const redSummonerInfo: SummonerMatchData[] = [];

      matchData.participants.forEach(
        (participant: RiotSummonerMatchData, index: number) => {
          const currentParticipant: SummonerMatchData = {
            gameName: participant.riotIdGameName,
            tagLine: participant.riotIdTagline,
            champion:
              participant.championName == "FiddleSticks"
                ? "Fiddlesticks"
                : participant.championName,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            kda:
              participant.deaths == 0
                ? "Perfect"
                : (
                    (participant.kills + participant.assists) /
                    participant.deaths
                  )
                    .toFixed(2)
                    .toString(),
          };

          if (participant.puuid === puuid) {
            currentSummonerDidWin = participant.win;
            currentSummonerMatchData = currentParticipant;
          }

          if (index < 5) {
            blueSummonerInfo.push(currentParticipant);
          } else {
            redSummonerInfo.push(currentParticipant);
          }
        }
      );

      const compiledMatchData: MatchData = {
        gameType: queueMode,
        winner: winningSide,
        currentSummonerDidWin: currentSummonerDidWin!,
        currentSummonerMatchData: currentSummonerMatchData!,
        blueSummoners: blueSummonerInfo,
        redSummoners: redSummonerInfo,
      };
      matchDataList.push(compiledMatchData);
    });

  return matchDataList;
};
