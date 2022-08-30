import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { backgroundGradient, otherGradient } from "../utils/styleUtils";
import { CharacterView, Frame } from "./CharacterView";
import SocketService from "../SocketService";
import { StatView } from "./StatView";
import { ActionView } from "./ActionView";

import { SpellTable } from "./SpellTable";
import { relative } from "path";
import { setOnKeyDown, useMountEffect } from "../utils/jsUtils";
import { getEnemy } from "../enemies";
import { EnemyView } from "./EnemyView";

interface BattleViewProps {
  gameData: any;
  leaveBattle: () => void;
}
const slide = keyframes`
  0%{
    translate(0px, 0px)
  }
  50%{
    translate(22px, 0px)
  }
  100%{
    translate(0px, 0px)
  }`;
const animationRule = css(
  ["", " 1s linear;"] as any as TemplateStringsArray,
  slide
);
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
export const Spell: any = styled.p`
  animation: ${casting};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;
export const FailedSpell: any = styled.p`
  animation: ${miscast};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;

const emerge = keyframes`
0%{ 
    transform: scale(0)
}
20%
{ transform: scale(.15)
}
40%
{ transform: scale(.25)
}
60%
{ transform: scale(.45)
}
80%
{ transform: scale(.75)
}
100%
{ transform: scale(1)
}
`;
const Wrap = styled.div`
  display: flex;
  flexdirection: column;
  gap: 0.5rem;
  animation: ${emerge};
  animationduration: 2s;
  animationiterationcount: once;
`;

export const BattleView: React.FC<BattleViewProps> = ({
  gameData,
  leaveBattle,
}) => {
  const [gameState, setGameState] = useState<any>(gameData);

  const { socket, update } = SocketService as any;

  function spellClickHandle(w: string) {
    update({
      type: "addWord",
      word: w,
      id: gameState.id,
    });
  }

  useEffect(() => {
    socket &&
      socket.on("update_res", (obj: object) => {
        setGameState({ ...obj });
        socket.gameData = { ...obj };
      });
  }, []);
  if (!gameState.concluded) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <EnemyView enemies={gameState.enemies} id={gameState.id} />;
        <Frame
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>{gameState.spellReq && gameState.spellReq.join(" ")}</p>
            <div style={{ display: "flex", minHeight: "5rem", gap: ".5rem" }}>
              {gameState.spellInput &&
                gameState.spellInput.map((s: any) => {
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
          </div>
        </Frame>
        <div style={{ display: "flex", gap: "1rem", zIndex: 3 }}>
          <Frame style={{ width: "60%" }}>
            <SpellTable
              id={gameState.id}
              spells={gameState.spellTable}
              spellInput={gameState.spellInput}
              clickHandler={spellClickHandle}
            />
          </Frame>

          <Frame
            style={{
              display: "flex",
              gap: "1rem",
              minHeight: "5rem",
              flexDirection: "column",
            }}
          >
            <StatView enemy={gameState.player} />

            <ActionView enemy={gameState.player} />
            <span
              style={{
                cursor: "default",
                border: `${
                  gameState.player.spell === "missle" ? "2px solid white" : ""
                }`,
              }}
              onClick={() =>
                update({
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
                border: `${
                  gameState.player.spell === "heal" ? "2px solid white" : ""
                }`,
              }}
              onClick={() =>
                update({
                  type: "spellSelect",
                  spell: "heal",
                  id: gameState.id,
                })
              }
            >
              Heal
            </span>
          </Frame>
        </div>
      </div>
    );
  } else {
    return (
      <Frame
        onClick={() => leaveBattle()}
        style={{
          position: "absolute",
          zIndex: 3,
          left: "50%",
          cursor: "default",
        }}
      >
        {gameState.score}
      </Frame>
    );
  }
};
