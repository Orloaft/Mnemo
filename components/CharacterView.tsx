import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { backgroundGradient } from "../utils/styleUtils";
import { Avatar } from "./Avatar";

import { Stats } from "./Stats";
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

interface CharacterViewProps {
  character: any;
}
export const Frame = styled.div`
  display: flex;
  // border: 2px solid #ffebcd;
  color: #ffebcd;
  border-radius: 0.25rem;
  padding: 0.5rem;
  z-index: 2;
  background: ${backgroundGradient};
`;
const FlipCard = styled.div`
  background-color: transparent;
  height: 100%;
  width: 25rem;
  perspective: 1000px;
  &:hover {
    & .innerCard {
      transform: rotateY(180deg);
    }
  }
`;
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
const slide = keyframes`
 0% {  transform: translate(0, 0); }
 50% {  transform: translate(-1rem, 0); }
 100% {  transform: translate(0, 0); }
`;

const Character = styled(Frame)`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  @media (min-width: 48rem) {
    width: 100%;
  }
  @media (min-width: 80rem) {
    width: 100%;
  }
`;
export const CharacterView: React.FC<CharacterViewProps> = ({ character }) => {
  return (
    <FlipCard>
      <InnerCard className="innerCard">
        <FrontCard>
          <Character>
            <Avatar />
            <Stats character={character} />
          </Character>
        </FrontCard>
        <BackCard>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          maiores rem praesentium impedit nulla ipsum, sed velit tempora quas
        </BackCard>
      </InnerCard>
    </FlipCard>
  );
};
