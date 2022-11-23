import axios from "axios";

import { useContext, useState } from "react";
import { UserContext } from "../pages";
import SignUpPageController from "./signUpPageController";
import { Frame } from "./CharacterView";
import { Form } from "./SignUpPageView";
import styled, { keyframes } from "styled-components";
import { backgroundGradient } from "../utils/styleUtils";
import { SignInPageController } from "./SignInPageController";
import { GuestController } from "./GuestController";
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
export const Button = styled.button`
  &:hover {
    animation: ${hoverRainbow};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  border: none;
  font-family: SilkScreen;
  font-size: 1.2rem;
  height: 20%;
  weight: 30%;
  z-index: 3;
  display: flex;
  cursor: pointer;
  color: #ffebcd;
  border-radius: 0.25rem;
  padding: 0.5rem;
  z-index: 2;
  background: ${backgroundGradient};
`;
export const SignIn = (props) => {
  const [status, setStatus] = useState("default");

  switch (status) {
    case "default":
      return (
        <div style={{ maxHeight: "5rem", display: "flex", gap: ".5rem" }}>
          {" "}
          <Button onClick={() => setStatus("sign in")}>sign in</Button>
          <Button onClick={() => setStatus("sign up")}>Sign up</Button>
          <Button onClick={() => setStatus("guest")}>Play as guest</Button>
        </div>
      );
    case "sign in":
      return <SignInPageController setStatus={setStatus} />;
    case "sign up":
      return (
        <Frame>
          <SignUpPageController setStatus={setStatus} />
        </Frame>
      );
    case "guest":
      return <GuestController setStatus={setStatus} />;
  }
};
