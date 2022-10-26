import styled from "styled-components";
import SocketService from "../SocketService";
import { ActionView } from "./ActionView";
import { Frame } from "./CharacterView";
import { StatView } from "./StatView";
import { uuid } from "uuidv4";
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
          {SocketService.getPlayer().knownSpells.map(
            (spell: { name: string; lvl: number }) => {
              return (
                <span
                  key={uuid()}
                  style={{
                    padding: ".25rem",
                    cursor: "default",
                    border: `${
                      player.spell.name === spell.name ? "2px solid white" : ""
                    }`,
                  }}
                  onClick={() =>
                    SocketService.update({
                      type: "spellSelect",
                      spell: spell,
                      id: gameState.id,
                    })
                  }
                >
                  {spell.name}
                </span>
              );
            }
          )}
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
