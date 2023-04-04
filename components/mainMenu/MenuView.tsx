import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { BattleView } from "../battle/BattleView";
import { PartyMenuView } from "./PartyMenuView";
import SocketService from "../../SocketService";
import { gameDataProps } from "../../gameData";
import { LobbyListView } from "../lobby/LobbyListView";
import { UserData } from "../user/UserData";
import { Frame } from "../LogInPanel";

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
const hoverRainbow = keyframes`
 
0% {
  border-color: #FF0000;
  color:#FF0000;
}
7% {
    border-color: FF3D00;
  color: FF3D00;
}
14% {
    border-color: #FF7A00;
  color:#FF7A00;
}
21% {
    border-color: #FFB800;
  color: #FFB800;
}
29% {
    border-color: #FFF500;
  color: #FFF500;
}
36% {
    border-color: #CCFF00;
  color: #CCFF00;
}
43% {
    border-color: #8FFF00;
  color: #8FFF00;
}
50% {
border-color: #52FF00;
  color: #52FF00;
}
57% {
 border-color: #14FF00;
  color: #14FF00;
}
64% {
border-color: #00FF29;
  color: #00FF29;
}
71% {
border-color: #00FF66;
  color:#00FF66;
}
79% {
    border-color: #FF7A00;
  color:#FF7A00;
}
86% {
    border-color: FF3D00;
  color: FF3D00;
}
100% {
    border-color: #FF0000;
    color:#FF0000;
  }
`;
const PartyWrap = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
const MenuButton = styled(Frame)`
  cursor: default;
  font-size: 1.5rem;
  &:hover {
    animation: ${hoverRainbow};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
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

export const MenuView: React.FC = (props) => {
  const [showComponent, setShowComponent] = useState("menu");
  // checks if there is an id stored to try and resume interrupted match
  const [matchId, setMatchId] = useState(false);

  const battleStart = () => {
    // SocketService.initGame();
    setShowComponent("settings");
  };
  const leaveBattle = () => {
    setShowComponent("menu");
  };
  useEffect(() => {
    localStorage.getItem("matchId") && setMatchId(true);
    localStorage.getItem("credentials") && SocketService.setPlayerId();

    SocketService &&
      SocketService.socket().on("update_res", (obj: gameDataProps) => {
        SocketService.setGameData(obj);
        if (obj && !obj.concluded) {
          localStorage.setItem("matchId", obj.id);

          showComponent !== "battle" && setShowComponent("battle");
        } else {
          localStorage.removeItem("matchId");
          SocketService.setLobbyData(null);
          setMatchId(false);
        }
      });
  }, []);
  switch (showComponent) {
    case "settings":
      return (
        <MenuContainer>
          <PartyWrap style={{ gap: ".5rem" }}>
            <MenuButton onClick={() => setShowComponent("menu")}>
              back
            </MenuButton>
            <MenuButton
              onClick={() => {
                SocketService.initGame("easy");
              }}
            >
              Easy
            </MenuButton>

            <MenuButton
              onClick={() => {
                SocketService.initGame("medium");
              }}
            >
              Medium
            </MenuButton>

            <MenuButton
              onClick={() => {
                SocketService.initGame("hard");
              }}
            >
              Hard
            </MenuButton>
          </PartyWrap>
        </MenuContainer>
      );
    case "battle":
      return (
        <BattleContainer>
          <BattleView
            gameData={SocketService.getGameData()}
            leaveBattle={leaveBattle}
          />
        </BattleContainer>
      );
    case "lobby":
      return (
        <LobbyListView
          setIsBattle={setShowComponent}
          battleStart={battleStart}
        />
      );
    case "menu":
      return (
        <MenuContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            {(matchId && (
              <MenuButton onClick={() => SocketService.resumeGame()}>
                Resume
              </MenuButton>
            )) || <MenuButton onClick={() => battleStart()}>Battle</MenuButton>}
            <MenuButton onClick={() => setShowComponent("lobby")}>
              Multiplayer
            </MenuButton>
            <MenuButton onClick={() => setShowComponent("user")}>
              User
            </MenuButton>
          </div>
          <PartyMenuView />
        </MenuContainer>
      );
    case "user":
      return <UserData setShowComponent={setShowComponent} />;
  }
};
