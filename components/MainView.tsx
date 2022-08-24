import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { LoadingView } from "./LoadingView";
import { MenuView } from "./MenuView";
import { Frame } from "./CharacterView";
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
export const LoadButton = styled(Frame)`
  font-size: 3rem;
  &:hover {
    animation: ${hoverRainbow};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`;
export const MainView: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  React.useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 25);
      if (seconds === 100) {
        toggle();
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  if (seconds < 100) {
    return (
      <>
        {(isActive && <LoadingView progress={`${seconds}%`} />) || (
          <LoadButton onClick={() => toggle()}>
            <span>Load Page</span>
          </LoadButton>
        )}
      </>
    );
  } else {
    return <MenuView />;
  }
};
