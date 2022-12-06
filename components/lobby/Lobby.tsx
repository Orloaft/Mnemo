import SocketService from "../../SocketService";
import { uuid } from "uuidv4";
import { LoadButton } from "../mainMenu/MainView";
import { Frame } from "../LogInPanel";
export const Lobby = ({ lobby, battleStart }) => {
  const submitMessage = (e) => {
    e.preventDefault();
    SocketService.sendMessage(e.target.message_body.value, lobby.id);
    e.target.message_body.value = "";
  };
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Frame>
          <form
            onSubmit={(e) => {
              submitMessage(e);
            }}
          >
            <input name="message_body" autoComplete="off"></input>
            <button>send</button>
          </form>

          <button
            onClick={() => {
              SocketService.leaveLobby(lobby.id);
            }}
          >
            leave Lobby
          </button>
        </Frame>
        <Frame>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {lobby.players.map((player) => {
              return <span key={player.id}>{player.name}</span>;
            })}
          </div>
        </Frame>
        <Frame>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {lobby.messages.map((msg) => {
              return (
                <span key={uuid()}>
                  {msg.author}:{msg.body}
                </span>
              );
            })}
          </div>
        </Frame>
        <LoadButton
          onClick={() => {
            SocketService.initGame("easy");
          }}
        >
          Easy
        </LoadButton>

        <LoadButton
          onClick={() => {
            SocketService.initGame("medium");
          }}
        >
          Medium
        </LoadButton>

        <LoadButton
          onClick={() => {
            SocketService.initGame("hard");
          }}
        >
          Hard
        </LoadButton>
      </div>
    </>
  );
};
