import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { BattleView } from "./BattleView";
import { CharacterView } from "./CharacterView";
import { LoadButton } from "./MainView";
import { PartyMenuView } from "./PartyMenuView";
import SocketService from "../SocketService";
import gameData, { gameDataProps } from "../gameData";
import { LobbyListView } from "./LobbyListView";

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

export const MenuView: React.FC = () => {
  const [isLobby, setIsLobby] = useState(false);
  const [isBattle, setIsBattle] = useState("menu");
  // checks if there is an id stored to try and resume interrupted match
  const [matchId, setMatchId] = useState(false);

  const battleStart = () => {
    // SocketService.initGame();
    setIsBattle("settings");
  };
  const leaveBattle = () => {
    console.log("ended battle");
    setIsBattle("menu");
  };
  useEffect(() => {
    localStorage.getItem("matchId") && setMatchId(true);
    localStorage.getItem("playerId") && SocketService.setPlayerId();

    SocketService.socket().on("update_res", (obj: gameDataProps) => {
      SocketService.setGameData(obj);
      if (obj && !obj.concluded) {
        localStorage.setItem("matchId", obj.id);

        isBattle === "menu" && setIsBattle("battle");
      } else {
        localStorage.removeItem("matchId");
        SocketService.setLobbyData(null);
        setMatchId(false);
      }
    });
  }, []);
  switch (isBattle) {
    case "settings":
      return (
        <MenuContainer>
          <PartyWrap style={{ gap: ".5rem" }}>
            <LoadButton
              onClick={() => {
                SocketService.initGame("easy");
              }}
            >
              Easy
            </LoadButton>

            <LoadButton
              onClick={() => {
                SocketService.initGame("medium");
              }}
            >
              Medium
            </LoadButton>

            <LoadButton
              onClick={() => {
                SocketService.initGame("hard");
              }}
            >
              Hard
            </LoadButton>
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
          toggleLobby={() => setIsLobby(!isLobby)}
          battleStart={battleStart}
        />
      );
    case "menu":
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
          <LoadButton onClick={() => setIsBattle("lobby")}>
            Multiplayer
          </LoadButton>
          <PartyMenuView />
        </MenuContainer>
      );
  }
};
