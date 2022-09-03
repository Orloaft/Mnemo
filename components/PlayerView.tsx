import styled from "styled-components";
import SocketService from "../SocketService";
import { ActionView } from "./ActionView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";
const PlayerFrame = styled(Frame)`
  background: linear-gradient(to right, #868f96 0%, #596164 100%);
  border: ${(props: { targeted: boolean }) =>
    props.targeted ? `2px solid white` : `2px solid transparent`};
`;
export const PlayerView = ({ gameState, player, targeted }) => {
  if (player.id === SocketService.getPlayerId()) {
    return (
      <PlayerFrame
        style={{
          display: "flex",
          gap: "1rem",
          minHeight: "5rem",
        }}
        targeted={targeted}
      >
        {" "}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StatView enemy={player} />

          <ActionView enemy={player} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              padding: ".25rem",
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
              padding: ".25rem",
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
      </PlayerFrame>
    );
  } else {
    return (
      <PlayerFrame
        style={{
          display: "flex",
          gap: "1rem",
          minHeight: "5rem",
        }}
        targeted={targeted}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StatView enemy={player} />

          <ActionView enemy={player} />
        </div>
      </PlayerFrame>
    );
  }
};
