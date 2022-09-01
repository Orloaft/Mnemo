import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { BattleView } from "./BattleView";
import { CharacterView } from "./CharacterView";
import { LoadButton } from "./MainView";
import { PartyMenuView } from "./PartyMenuView";
import SocketService from "../SocketService";
import gameData, { gameDataProps } from "../gameData";

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
const PartyWrap = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
const Box = styled.div`
  position: relative;
  height: 50%;

  width: auto;
`;
export const MenuContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  position: absolute;
  top: 25%;
  animation: ${emerge};
  animation-duration: 0.5s;
  animation-iteration-count: once;
  animation-timing-function: linear;
  @media (min-width: 48rem) {
    flex-direction: row;
    gap: 0.75rem;
  }
  @media (min-width: 80rem) {
  }
`;
const BattleContainer = styled.div`
  animation: ${emerge};
  animation-duration: 0.5s;
  animation-iteration-count: once;
  animation-timing-function: linear;
`;

export const MenuView: React.FC<{ toggleLobby: () => void }> = ({
  toggleLobby,
}) => {
  const [isBattle, setIsBattle] = useState(false);
  // checks if there is an id stored to try and resume interrupted match
  const [matchId, setMatchId] = useState(false);

  const battleStart = () => {
    SocketService.initGame();
  };
  const leaveBattle = () => {
    console.log("ended battle");
    setIsBattle(false);
  };
  useEffect(() => {
    localStorage.getItem("matchId") && setMatchId(true);

    SocketService.socket().on("update_res", (obj: gameDataProps) => {
      SocketService.setGameData(obj);
      if (obj && !obj.concluded) {
        localStorage.setItem("matchId", obj.id);
        if (
          !obj.participatingSockets.find(
            (socket) => socket === SocketService.socket().id
          )
        ) {
          SocketService.update({
            type: "addPlayerSocket",
            socket: SocketService.socket().id,
            id: obj.id,
          });
        }

        !isBattle && setIsBattle(true);
      } else {
        localStorage.removeItem("matchId");
        setMatchId(false);
      }
    });
  }, []);
  if (isBattle) {
    return (
      <BattleContainer>
        <BattleView
          gameData={SocketService.getGameData()}
          leaveBattle={leaveBattle}
        />
      </BattleContainer>
    );
  } else {
    return (
      <MenuContainer>
        {(matchId && (
          <PartyWrap>
            <LoadButton onClick={() => SocketService.resumeGame()}>
              Resume
            </LoadButton>
          </PartyWrap>
        )) || (
          <PartyWrap>
            <LoadButton onClick={() => battleStart()}>Battle</LoadButton>
          </PartyWrap>
        )}
        <LoadButton onClick={() => toggleLobby()}>Multiplayer</LoadButton>
        <PartyMenuView />
      </MenuContainer>
    );
  }
};
