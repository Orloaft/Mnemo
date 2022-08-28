import { ReactNode, useState } from "react";
import styled from "styled-components";
import { otherGradient } from "../utils/styleUtils";
import { Frame } from "./CharacterView";

export const InnerCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 1.6s;
  transform-style: preserve-3d;
`;
export const FrontCard = styled(Frame)`
  position: absolute;
  width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;
export const BackCard = styled(Frame)`
  width: 100%;
  height: auto;
  background: ${otherGradient}
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: rotateY(180deg);
`;

export const SpellWord = ({ children, handleClick }) => {
  const [clicked, setClicked] = useState(false);
  const FlipCard = styled.div`
    background-color: transparent;

    perspective: 1000px;

    ${clicked
      ? ` 
          & .innerCard {
            transform: rotateY(180deg);
           
           
          }
        `
      : ``}
  `;
  return (
    <FlipCard>
      <InnerCard className="innerCard">
        <FrontCard
          onClick={() => {
            setClicked(true);
            handleClick();
          }}
          style={{ cursor: "grab" }}
        >
          {children}
        </FrontCard>
        <BackCard style={{ cursor: "default", color: "black" }}>
          {children}
        </BackCard>
      </InnerCard>
    </FlipCard>
  );
};
