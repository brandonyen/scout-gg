import { RiotSummonerMatchData } from "./RiotSummonerMatchData";

export interface RiotMatchData {
  queueId: number;
  endOfGameResult: string;
  participants: RiotSummonerMatchData[];
}
