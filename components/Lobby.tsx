import { Frame } from "./CharacterView";
import SocketService from "../SocketService";
import { uuid } from "uuidv4";
export const Lobby = ({ lobby, battleStart }) => {
  const submitMessage = (e) => {
    e.preventDefault();
    SocketService.sendMessage(e.target.message_body.value, lobby.id);
  };
  return (
    <Frame>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {lobby.players.map((player) => {
          return <span key={player.id}>{player.name}</span>;
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lobby.messages.map((msg) => {
          return (
            <span key={uuid()}>
              {msg.author}:{msg.body}
            </span>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          submitMessage(e);
        }}
      >
        <input name="message_body"></input>
        <button>send</button>
      </form>
      <button
        onClick={() => {
          battleStart();
        }}
      >
        start game
      </button>
      <button
        onClick={() => {
          SocketService.leaveLobby(lobby.id);
        }}
      >
        leave Lobby
      </button>
    </Frame>
  );
};
