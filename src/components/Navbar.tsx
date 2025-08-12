import {
  Button,
  Input,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import servers from "../data/servers";
import { useState } from "react";
import { Routing, ServerOption } from "../interface/Routing";

interface NavbarProps {
  handleSearch: (gameName: string, tagLine: string, routing: Routing) => void;
}

const Navbar = ({ handleSearch }: NavbarProps) => {
  const [selectedServer, setSelectedServer] = useState<ServerOption>(
    servers[0]
  );
  const [gameNameInput, setGameNameInput] = useState<string>("");
  const [tagLineInput, setTagLineInput] = useState<string>("");

  return (
    <div className="p-8 flex items-center">
      <img src="/src/assets/swords.png" className="size-8" />
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-row rounded-lg shadow-lg p-4">
        <div className="mr-8">
          <Listbox value={selectedServer} onChange={setSelectedServer}>
            <ListboxButton className="bg-blue-400 rounded-lg py-2 px-4 text-white cursor-pointer">
              {selectedServer.label}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="bg-blue-400 rounded-lg cursor-pointer mt-1"
            >
              {servers.map((server) => (
                <ListboxOption
                  key={server.id}
                  value={server}
                  className="hover:bg-blue-100 py-2 px-4 text-white text-center"
                >
                  {server.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <Input
          placeholder="Enter Game Name"
          className="outline-none w-60"
          value={gameNameInput}
          onChange={(e) => setGameNameInput(e.target.value)}
        />
        <Input
          placeholder="Enter Tag Line"
          className="outline-none w-40"
          value={tagLineInput}
          onChange={(e) => setTagLineInput(e.target.value)}
        />
        <Button
          disabled={!gameNameInput && !tagLineInput}
          className={`${
            gameNameInput && tagLineInput
              ? "cursor-pointer bg-blue-400"
              : "cursor-not-allowed bg-gray-400"
          } rounded-lg py-2 px-4 text-white transition-colors duration-300`}
          onClick={() =>
            handleSearch(gameNameInput, tagLineInput, selectedServer.value)
          }
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
