import styled from "styled-components";
import SocketService from "../SocketService";
import { ActionView } from "./ActionView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";
const PlayerFrame = styled(Frame)`
  border: ${(props: { targeted: boolean }) =>
    props.targeted ? `2px solid white` : ``};
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
