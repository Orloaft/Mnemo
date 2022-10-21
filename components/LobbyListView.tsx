import { useEffect, useState } from "react";
import { MenuContainer } from "./MenuView";
import SocketService from "../SocketService";
import { Frame } from "./CharacterView";
import { Lobby } from "./Lobby";
import { validateRoom } from "../utils/jsUtils";
export const LobbyListView: React.FC<{
  setIsBattle: any;
  battleStart: any;
}> = ({ setIsBattle, battleStart }) => {
  const [lobby, setLobby] = useState(false);
  const [lobbyList, setLobbyList] = useState([]);
  const [message, setMessage] = useState("");
  const createLobby = (e) => {
    e.preventDefault();

    if (!validateRoom(e.target.lobby_name.value)) {
      SocketService.initLobby(e.target.lobby_name.value);
    } else {
      setMessage(validateRoom(e.target.lobby_name.value));
    }
  };
  useEffect(() => {
    SocketService.getGames();
    SocketService.socket().on("lobby_state_res", (lobby) => {
      if (lobby.players.find((p) => p.id === SocketService.getPlayerId())) {
        SocketService.setLobbyData({ ...lobby });
        setLobby(lobby);
      } else {
        setLobby(false);
      }
    });
    SocketService.socket().on("get_games_res", (lobbies) => {
      setLobbyList([...lobbies]);
    });
  }, []);
  return (
    <MenuContainer style={{ display: "flex", flexDirection: "column" }}>
      {(lobby && <Lobby lobby={lobby} battleStart={battleStart} />) || (
        <>
          {" "}
          {lobbyList.map((game) => {
            return (
              <Frame
                key={game.id}
                onClick={() => {
                  SocketService.joinLobby(game.id);
                }}
              >
                {game.name}
              </Frame>
            );
          })}{" "}
          <button
            style={{ zIndex: "3" }}
            onClick={() => SocketService.getGames()}
          >
            refresh
          </button>
          <Frame>
            <form
              onSubmit={(e) => {
                createLobby(e);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input name="lobby_name" autoComplete="off"></input>
                {message}
                <button style={{ zIndex: "3" }}>create</button>
              </div>
            </form>{" "}
          </Frame>
          <button style={{ zIndex: "3" }} onClick={() => setIsBattle("menu")}>
            back
          </button>{" "}
        </>
      )}
    </MenuContainer>
  );
};
