import { SummonerMatchData } from "../interface/SummonerMatchData";

interface DetailedTeamPanelProps {
  teamName: "Blue" | "Red";
  summoners: SummonerMatchData[];
  winner: string;
  ddVersion: string;
  handleSearch: (gameName: string, tagLine: string) => void;
}

const DetailedTeamPanel = ({
  teamName,
  summoners,
  winner,
  ddVersion,
  handleSearch,
}: DetailedTeamPanelProps) => {
  return (
    <div
      className={`flex flex-col w-1/2 h-full p-8 ${
        winner == teamName ? "bg-sky-200" : "bg-red-200"
      }`}
    >
      <span className="mb-4">
        <strong>{winner == teamName ? "Victory" : "Defeat"}</strong> ({teamName}{" "}
        Team)
      </span>
      <div className="flex flex-col gap-4">
        {summoners.map((summoner, index) => (
          <div className="flex items-center" key={index}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${summoner.champion}.png`}
              className="size-12 mr-2 rounded-sm"
              alt={`${summoner.champion} icon`}
            />
            <div className="flex flex-col">
              <p
                className="truncate cursor-pointer"
                onClick={() =>
                  handleSearch(summoner.gameName, summoner.tagLine)
                }
              >
                {summoner.gameName}
              </p>
              <p>
                {summoner.kills}/{summoner.deaths}/{summoner.assists} (
                {summoner.kda} KDA)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedTeamPanel;
