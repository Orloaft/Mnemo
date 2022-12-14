import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import SocketService from "../../SocketService";
import { SpellTable } from "./SpellTable";
import EnemyView from "./EnemyView";
import { uuid } from "uuidv4";
import { PlayerView } from "./PlayerView";
import { LoadButton } from "../mainMenu/MainView";
import { BattleLog } from "./BattleLog";
import { Frame } from "../LogInPanel";

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

const casting = keyframes`
 
    0% {
      letter-spacing: 0rem;
      color: teal;
    }
    10% {
      letter-spacing: 0.01rem;
      color: aqua;
    }
    20% {
      letter-spacing: 0.015rem;
      color: rgb(234, 243, 243);
    }
  
    30% {
      letter-spacing: 0.02rem;
      color: rgb(215, 255, 106);
    }
  
    40% {
      letter-spacing: 0.025rem;
      color: rgb(255, 96, 189);
    }
    50% {
      letter-spacing: 0.03rem;
      color: rgb(255, 185, 153);
    }
    60% {
      letter-spacing: 0.025rem;
      color: blue;
    }
    70% {
      letter-spacing: 0.02rem;
      color: blueviolet;
    }
    80% {
      letter-spacing: 0.015;
      color: rgb(81, 247, 30);
    }
    90% {
      letter-spacing: 0.01;
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
      letter-spacing: 0.01rem;
      color: red;
    }
    20% {
      letter-spacing: 0.015rem;
      color: red;
    }
  
    30% {
      letter-spacing: 0.02rem;
      color: red;
    }
  
    40% {import { Socket } from "socket.io-client";
      letter-spacing: 0.025rem;
      color: red;
    }
    50% {
      letter-spacing: 0.03rem;
      color: red;
    }
    60% {
      letter-spacing: 0.025rem;
      color: red;
    }
    70% {
      letter-spacing: 0.02rem;
      color: red;
    }
    80% {
      letter-spacing: 0.015;
      color: red;
    }
    90% {
      letter-spacing: 0.01;
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
  @media (min-width: 48rem) {
    font-size: 1.2rem;
  }
`;
export const FailedSpell: any = styled.p`
  animation: ${miscast};
  animation-duration: 1s;
  animation-iteration-count: once;
  animation-timing-function: linear;
  @media (min-width: 48rem) {
    font-size: 1.2rem;
  }
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
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 48rem) {
    flex-direction: row;
  }
`;
const PlayerSpellWords = styled.div`
  display: flex;
  min-height: 1.75rem;
  gap: 0.5rem;
  align-items: center;

  @media (min-width: 48rem) {
    & span {
      font-size: 1rem;
    }
    & p {
      margin: 0;
      font-size: 1rem;
    }
  }
`;
export const BattleView: React.FC<BattleViewProps> = ({
  gameData,
  leaveBattle,
}) => {
  const [gameState, setGameState] = useState<any>(gameData);
  let player = gameState.players.find(
    (p) => p.id === JSON.parse(localStorage.getItem("credentials")).token
  );
  function spellClickHandle(w: string) {
    SocketService.update({
      type: "addWord",
      word: w,
      id: gameState.id,
    });
  }
  const getHandlePlayerClick = (i) => {
    return () => {
      SocketService.update({
        type: "playerClicked",
        targetIndex: i,
        id: gameData.id,
      });
    };
  };
  useEffect(() => {
    SocketService.socket().on("update_res", (obj: object) => {
      setGameState({ ...obj });
      SocketService.setGameData(obj);
    });
  }, []);
  if (!gameState.concluded && !gameState.paused) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <EnemyView enemies={gameState.enemies} id={gameState.id} />
        <BattleLog gameLog={gameState.log} />
        <Frame
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: ".75rem",
              lineHeight: ".15rem",
            }}
          >
            <PlayerSpellWords>
              {gameState &&
                gameState.players
                  .find(
                    (p) =>
                      p.id ===
                      JSON.parse(localStorage.getItem("credentials")).token
                  )
                  .spellReq.map((word, i) => {
                    if (
                      !gameState.players.find(
                        (p) =>
                          p.id ===
                          JSON.parse(localStorage.getItem("credentials")).token
                      ).spellInput[i]
                    ) {
                      return <span key={uuid()}>{word}</span>;
                    } else if (
                      gameState.players.find(
                        (p) => p.id === SocketService.getPlayerId()
                      ).spellInput[i] ===
                      gameState.players.find(
                        (p) => p.id === SocketService.getPlayerId()
                      ).spellReq[i]
                    ) {
                      return <Spell key={uuid()}>{word}</Spell>;
                    } else {
                      return <FailedSpell key={uuid()}>{word}</FailedSpell>;
                    }
                  })}
            </PlayerSpellWords>
          </div>
        </Frame>
        <div style={{ display: "flex", gap: "1rem", zIndex: 3 }}>
          <div style={{ width: "60%" }}>
            <SpellTable
              id={gameState.id}
              spells={gameState.spellTable}
              player={
                gameState.players &&
                gameState.players.find(
                  (p) => p.id === SocketService.getPlayerId()
                )
              }
              clickHandler={spellClickHandle}
            />
          </div>
          <PlayerContainer>
            {gameState.players.map((player, i) => {
              if ( 
                SocketService.getPlayer().spell.name === "heal" &&
                SocketService.getPlayer().target === i
              ) {
              
                return (
                  <PlayerView
                    key={uuid()}
                    gameState={gameState}
                    player={player}
                    targeted={true}
                    handler={getHandlePlayerClick(i)}
                  />
                );
              } else {
         
                return (
                  <PlayerView
                    key={uuid()}
                    gameState={gameState}
                    player={player}
                    targeted={false}
                    handler={getHandlePlayerClick(i)}
               
                  />
                );
              }
            })}
          </PlayerContainer>
        </div>
      </div>
    );
  } else if (gameState.paused) {
    return (
      <Frame
        onClick={() =>
          SocketService.update({ type: "pause", id: gameState.id })
        }
        style={{
          position: "absolute",
          zIndex: 3,
          left: "25%",
          top: "25%",
          cursor: "default",
        }}
      >
        PAUSED
      </Frame>
    );
  } else {
    return (
      <>
        <Frame
          style={{
            position: "absolute",
            zIndex: 3,
            left: "25%",
            top: "25%",
            cursor: "default",
          }}
        >
          {gameState.score}
        </Frame>
        <LoadButton
          style={{
            position: "absolute",
            zIndex: 3,
          }}
          onClick={() => {
            leaveBattle();
          }}
        >
          back
        </LoadButton>
      </>
    );
  }
};
