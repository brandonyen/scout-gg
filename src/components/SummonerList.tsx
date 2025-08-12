import { SummonerMatchData } from "../interface/SummonerMatchData";

interface SummonerListProps {
  summoners: SummonerMatchData[];
  ddVersion: string;
  handleSearch: (gameName: string, tagLine: string) => void;
}

const SummonerList = ({
  summoners,
  ddVersion,
  handleSearch,
}: SummonerListProps) => {
  return (
    <div className="flex flex-col w-24 gap-1">
      {summoners.map((summoner, index) => (
        <div className="flex items-center gap-1" key={index}>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${summoner.champion}.png`}
            className="size-6 rounded-xs"
            alt={`${summoner.champion} icon`}
          />
          <span
            className="text-xs truncate cursor-pointer"
            onClick={() => handleSearch(summoner.gameName, summoner.tagLine)}
          >
            {summoner.gameName}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SummonerList;
