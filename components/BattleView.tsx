import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { backgroundGradient, otherGradient } from "../utils/styleUtils";
import { Frame } from "./CharacterView";
import SocketService from "../SocketService";

interface clickProps {
  clicked?: boolean;
  onClick?: () => void;
}
interface BattleViewProps {
  gameData: any;
}
const casting = keyframes`
 
    0% {
      letter-spacing: 0rem;
      color: teal;
    }
    10% {
      letter-spacing: 0.1rem;
      color: aqua;
    }
    20% {
      letter-spacing: 0.15rem;
      color: rgb(234, 243, 243);
    }
  
    30% {
      letter-spacing: 0.2rem;
      color: rgb(215, 255, 106);
    }
  
    40% {
      letter-spacing: 0.25rem;
      color: rgb(255, 96, 189);
    }
    50% {
      letter-spacing: 0.3rem;
      color: rgb(255, 185, 153);
    }
    60% {
      letter-spacing: 0.25rem;
      color: blue;
    }
    70% {
      letter-spacing: 0.2rem;
      color: blueviolet;
    }
    80% {
      letter-spacing: 0.15;
      color: rgb(81, 247, 30);
    }
    90% {
      letter-spacing: 0.1;
      color: rgb(252, 220, 81);
    }
    100% {
      letter-spacing: 0;
      color: white;
    }
  
`;
const miscast = keyframes`
 
    0% {
      letter-spacing: 0rem;
      color: red;
    }
    10% {
      letter-spacing: 0.1rem;
      color: red;
    }
    20% {
      letter-spacing: 0.15rem;
      color: red;
    }
  
    30% {
      letter-spacing: 0.2rem;
      color: red;
    }
  
    40% {
      letter-spacing: 0.25rem;
      color: red;
    }
    50% {
      letter-spacing: 0.3rem;
      color: red;
    }
    60% {
      letter-spacing: 0.25rem;
      color: red;
    }
    70% {
      letter-spacing: 0.2rem;
      color: red;
    }
    80% {
      letter-spacing: 0.15;
      color: red;
    }
    90% {
      letter-spacing: 0.1;
      color: red;
    }
    100% {
      letter-spacing: 0;
      color: red;
    }
  
`;
const Spell: any = styled.p`
  animation: ${casting};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;
const FailedSpell: any = styled.p`
  animation: ${miscast};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;
const WordBox = styled(Frame)`
  background: ${(props: clickProps) =>
    props.clicked ? otherGradient : backgroundGradient};
`;
export const BattleView: React.FC<BattleViewProps> = ({ gameData }) => {
  const [gameState, setGameState] = useState<any>(gameData);

  const { socket, update } = SocketService as any;

  useEffect(() => {
    socket &&
      socket.on("update_res", (obj: object) => {
        setGameState({ ...obj });
        socket.gameData = { ...obj };
      });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Frame style={{ display: "flex", flexDirection: "column" }}>
        <p>{gameState.enemy.name}</p>
        <p>{gameState.enemy.life}</p>
      </Frame>
      <Frame style={{ display: "flex", flexDirection: "column" }}>
        <p>{gameState.spellReq.join(" ")}</p>
        <div style={{ display: "flex", minHeight: "5rem" }}>
          {gameState.spellInput.map((s: any) => {
            switch (gameState.animation) {
              case "casting":
                return <Spell key={s}>{s}</Spell>;
              case "failed":
                return <FailedSpell key={s}>{s}</FailedSpell>;
              case "normal":
                return <p key={s}>{s}</p>;
            }
          })}
        </div>
      </Frame>
      <Frame style={{ width: "50%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
          }}
        >
          {gameState.spellTable.map((w: string) => {
            if (gameState.spellInput.find((e: string) => e === w)) {
              return (
                <WordBox
                  style={{ cursor: "default", color: "black" }}
                  key={w}
                  clicked
                >
                  {w}
                </WordBox>
              );
            } else {
              return (
                <WordBox
                  style={{ cursor: "grab" }}
                  onClick={() =>
                    update({ type: "addWord", word: w, id: gameState.id })
                  }
                  key={w}
                >
                  {w}
                </WordBox>
              );
            }
          })}
        </div>
      </Frame>
    </div>
  );
};
