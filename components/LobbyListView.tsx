import { useEffect, useState } from "react";
import { MenuContainer } from "./MenuView";
import SocketService from "../SocketService";
import { Frame } from "./CharacterView";
export const LobbyListView: React.FC<{ toggleLobby: () => void }> = ({
  toggleLobby,
}) => {
  const [gameList, setGameList] = useState([]);
  useEffect(() => {
    SocketService.getGames();
    SocketService.socket.on("get_games_res", (games) => {
      setGameList([...games]);
    });
  }, []);
  return (
    <MenuContainer style={{ display: "flex", flexDirection: "column" }}>
      {gameList.map((game) => {
        return <Frame key={game.id}>{game.id}</Frame>;
      })}
      <button style={{ zIndex: "3" }} onClick={() => toggleLobby()}>
        back
      </button>{" "}
      <button style={{ zIndex: "3" }} onClick={() => SocketService.getGames()}>
        refresh
      </button>
    </MenuContainer>
  );
};
