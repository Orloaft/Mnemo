import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { BattleView } from "./BattleView";
import { CharacterView } from "./CharacterView";
import { LoadButton } from "./MainView";
import { PartyMenuView } from "./PartyMenuView";
import SocketService from "../SocketService";

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
  height: 100%;
  min-height: 8rem;
  width: auto;
`;
const MenuContainer = styled.div`
  width: 75%;
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

export const MenuView: React.FC = () => {
  const [isBattle, setIsBattle] = useState(false);
  const { socket } = SocketService as any;
  const battleStart = () => {
    SocketService.connect();
    SocketService.initGame();
  };
  useEffect(() => {
    socket &&
      socket.on("update_res", (obj: object) => {
        socket.gameData = obj;
        setIsBattle(true);
      });
  }, []);

  return (
    <MenuContainer>
      <div
        style={{
          display: "flex",
          width: "41%",
          zIndex: 3,
          justifyContent: "center",
        }}
      >
        <PartyWrap>
          <Box>
            <CharacterView />
          </Box>
          {(isBattle && (
            <Box>
              <BattleView />
            </Box>
          )) || (
            <Box>
              <LoadButton onClick={() => battleStart()}>Battle</LoadButton>
            </Box>
          )}
        </PartyWrap>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          width: "59%",
          zIndex: 3,
        }}
      >
        <PartyMenuView />
      </div>
    </MenuContainer>
  );
};
