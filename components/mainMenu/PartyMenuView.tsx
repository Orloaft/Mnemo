import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { setTimeout } from "timers";
import { UserContext } from "../../pages";
import { backgroundGradient } from "../../utils/styleUtils";
import { Frame } from "../LogInPanel";
export const InnerCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 1s;
  transform-style: preserve-3d;
`;
export const FrontCard = styled.div`
  position: absolute;
  width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;
export const BackCard = styled(Frame)`
  position: absolute;
  width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: rotateY(180deg);
`;

const PartyMenu = styled.div`
  z-index: 4;
  width: auto;
  min-width: 15rem;
  flex-direction: column;
  @media (min-width: 48rem) {
    width: 30%;
  }
  @media (min-width: 80rem) {
    width: 20%;
  }
`;

const accordionText = keyframes`
 
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

interface PartyMenuViewProps {}
export const PartyMenuView = (props: PartyMenuViewProps) => {
  const [backContent, setBackContent] = React.useState<any>(null);
  const userContext = useContext(UserContext);
  const MenuSpan = styled.span`
    cursor: default;
    font-size: 2rem;

    &:hover {
      animation: ${accordionText};
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  `;

  const OptionWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 15rem;
    // border: 2px solid #ffebcd;
    color: #ffebcd;
    border-radius: 0.25rem;
    padding: 0.5rem;
    zindex: 2;
    background: ${backgroundGradient};
  `;
  const FlipCard = styled.div`
    background-color: transparent;
    height: 100%;
    width: 100%;
    perspective: 1000px;
    ${backContent
      ? ` 
        & .innerCard {
          transform: rotateY(180deg);
        
      }`
      : ``}
  `;
  return (
    <PartyMenu>
      <FlipCard>
        <InnerCard className="innerCard">
          <FrontCard style={{ height: "100%" }}>
            <OptionWrap>
              <MenuSpan
                onClick={() => {
                  setBackContent(
                    <>
                      <span>Heal: recover target players hp</span>
                      <span>Missle: deal damage to target</span>
                      <span>Blast: deal damage to each enemy</span>
                      <span>Silence: Interrupt enemy casting</span>
                      <span>Curse: reduce target damage</span>
                      <span>Revive: wake up a fainted player</span>
                      <span>Shield: reduce incoming damage</span>
                    </>
                  );
                }}
              >
                Abilities
              </MenuSpan>
              <MenuSpan
                onClick={() => {
                  setBackContent(
                    <>
                      <span>Incantations - QWERASDF</span>
                      <span>Select spell - down/up arrow</span>
                      <span>Toggle target - left/right arrow</span>
                      <span>Toggle pause - enter</span>
                    </>
                  );
                }}
              >
                Controls
              </MenuSpan>
              <MenuSpan
                onClick={() => {
                  setBackContent(
                    <span>
                      Press Battle to face a gauntlet of enemies. After
                      selecting a spell, match the words displayed to perform
                      the cast. You need to wait until your energy is full in
                      order to cast spells.
                    </span>
                  );
                }}
              >
                About
              </MenuSpan>
              <MenuSpan
                onClick={() => {
                  localStorage.removeItem("credentials");
                  userContext.setUser({});
                }}
              >
                Sign out
              </MenuSpan>
            </OptionWrap>
          </FrontCard>
          <BackCard
            style={{
              height: "15rem",
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
            }}
            onMouseLeave={() => setTimeout(() => setBackContent(""), 1000)}
          >
            {backContent}
          </BackCard>
        </InnerCard>
      </FlipCard>
    </PartyMenu>
  );
};
