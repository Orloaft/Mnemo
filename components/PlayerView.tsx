import SocketService from "../SocketService";
import { ActionView } from "./ActionView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";

export const PlayerView = ({ gameState, player }) => {
  if (player.id === SocketService.getPlayerId()) {
    return (
      <Frame
        style={{
          display: "flex",
          gap: "1rem",
          minHeight: "5rem",
        }}
      >
        {" "}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StatView enemy={player} />

          <ActionView enemy={player} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              cursor: "default",
              border: `${player.spell === "missle" ? "2px solid white" : ""}`,
            }}
            onClick={() =>
              SocketService.update({
                type: "spellSelect",
                spell: "missle",
                id: gameState.id,
              })
            }
          >
            Missle
          </span>
          <span
            style={{
              cursor: "default",
              border: `${player.spell === "heal" ? "2px solid white" : ""}`,
            }}
            onClick={() =>
              SocketService.update({
                type: "spellSelect",
                spell: "heal",
                id: gameState.id,
              })
            }
          >
            Heal
          </span>
        </div>
      </Frame>
    );
  } else {
    return (
      <Frame
        style={{
          display: "flex",
          gap: "1rem",
          minHeight: "5rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StatView enemy={player} />

          <ActionView enemy={player} />
        </div>
      </Frame>
    );
  }
};
