import { SummonerMatchData } from "./SummonerMatchData";

export interface MatchData {
  gameType: string;
  winner: "Blue" | "Red";
  currentSummonerDidWin: boolean;
  currentSummonerMatchData: SummonerMatchData;
  blueSummoners: SummonerMatchData[];
  redSummoners: SummonerMatchData[];
}
