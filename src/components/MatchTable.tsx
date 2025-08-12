import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { MatchData } from "../interface/MatchData";
import SummonerList from "./SummonerList";
import { useState } from "react";
import DetailedTeamPanel from "./DetailedTeamPanel";

interface MatchTableProps {
  matchData: MatchData;
  handleSearch: (gameName: string, tagLine: string) => void;
  ddVersion: string;
}

const MatchTable = ({
  matchData,
  handleSearch,
  ddVersion,
}: MatchTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${
          matchData.currentSummonerDidWin ? "bg-sky-200" : "bg-red-200"
        } flex flex-row p-2 items-center rounded-lg`}
      >
        <div className="flex flex-col text-center w-20 ml-6 mr-8">
          <strong>{matchData.gameType}</strong>
          <p>{matchData.currentSummonerDidWin ? "Victory" : "Defeat"}</p>
        </div>
        <div className="flex flex-row items-center">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${matchData.currentSummonerMatchData.champion}.png`}
            className="size-20 mr-6 rounded-lg"
            alt="Current summoner champion icon"
          />
          <div className="flex flex-col">
            <div className="flex items-center">
              <strong>
                {matchData.currentSummonerMatchData.kills} /&nbsp;
              </strong>
              <strong className="text-red-500">
                {matchData.currentSummonerMatchData.assists}
              </strong>
              <strong>
                &nbsp;/ {matchData.currentSummonerMatchData.assists}
              </strong>
            </div>
            <p>{matchData.currentSummonerMatchData.kda} KDA</p>
          </div>
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
          <SummonerList
            summoners={matchData.blueSummoners}
            ddVersion={ddVersion}
            handleSearch={handleSearch}
          />
          <SummonerList
            summoners={matchData.redSummoners}
            ddVersion={ddVersion}
            handleSearch={handleSearch}
          />
          <ChevronDownIcon
            className={`size-12 transition-transform duration-300 ease-in-out cursor-pointer ${
              matchData.currentSummonerDidWin ? "fill-blue-400" : "fill-red-400"
            } ${isOpen ? "rotate-180" : "rotate-0"}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-row rounded-lg overflow-hidden">
          <DetailedTeamPanel
            teamName="Blue"
            summoners={matchData.blueSummoners}
            winner={matchData.winner}
            ddVersion={ddVersion}
            handleSearch={handleSearch}
          />
          <DetailedTeamPanel
            teamName="Red"
            summoners={matchData.redSummoners}
            winner={matchData.winner}
            ddVersion={ddVersion}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </>
  );
};

export default MatchTable;
