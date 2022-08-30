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
const MenuContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

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

export const MenuView: React.FC = () => {
  const [isBattle, setIsBattle] = useState(false);
  const { socket } = SocketService as any;
  const battleStart = () => {
    console.log(socket.id);
    SocketService.initGame();
  };
  const leaveBattle = () => {
    setIsBattle(false);
  };
  useEffect(() => {
    socket &&
      socket.on("update_res", (obj: gameDataProps) => {
        socket.gameData = { ...obj };
        !isBattle && setIsBattle(true);
      });
  }, []);
  if (isBattle) {
    return (
      <BattleContainer>
        <BattleView gameData={socket.gameData} leaveBattle={leaveBattle} />
      </BattleContainer>
    );
  } else {
    return (
      <MenuContainer>
        <PartyWrap>
          <LoadButton onClick={() => battleStart()}>Battle</LoadButton>
          {/* <Box>
              <CharacterView character={{ life: 100, maxLife: 100 }} />
            </Box> */}{" "}
        </PartyWrap>
        <PartyMenuView />
      </MenuContainer>
    );
  }
};
