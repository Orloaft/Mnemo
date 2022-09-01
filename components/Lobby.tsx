import { Frame } from "./CharacterView";
import SocketService from "../SocketService";
export const Lobby = ({ lobby }) => {
  const submitMessage = (e) => {
    e.preventDefault();
    SocketService.sendMessage(e.target.message_body.value, lobby.id);
  };
  return (
    <Frame>
      <div>
        {lobby.players.map((player) => {
          return <span>{player.name}</span>;
        })}
      </div>

      <div>chat here</div>

      <form
        onSubmit={(e) => {
          submitMessage(e);
        }}
      >
        <input name="message_body"></input>
        <button>send</button>
      </form>
    </Frame>
  );
};
