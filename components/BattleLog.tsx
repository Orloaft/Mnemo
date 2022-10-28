import { Frame } from "./CharacterView";

export const BattleLog = ({ gameLog }) => {
  return (
    <Frame
      style={{
        padding: "1rem",
        height: "5rem",
        overflowY: "scroll",
        flexDirection: "column",
        fontSize: ".75rem",
      }}
    >
      {gameLog &&
        gameLog.map((gameAction, i) => {
          return <span key={i}>{gameAction}</span>;
        })}
    </Frame>
  );
};
