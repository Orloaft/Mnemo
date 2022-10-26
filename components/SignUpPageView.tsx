import styled, { keyframes } from "styled-components";
import { backgroundGradient } from "../utils/styleUtils";
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
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const SignUpPageView = (props) => {
  return (
    <div>
      <Form onSubmit={props.submit}>
        EMAIL
        <input
          onChange={(e) => props.onChange(e, "email")}
          value={props.form.email}
          name="email"
        ></input>
        USERNAME
        <input
          onChange={(e) => props.onChange(e, "name")}
          value={props.form.name}
          name="name"
        ></input>
        PASSWORD
        <input
          onChange={(e) => props.onChange(e, "password")}
          value={props.form.password}
          type="password"
          name="password"
        ></input>{" "}
        {props.message}
        <Button type="submit">Sign Up</Button>
        <Button onClick={() => props.setStatus("sign in")}>back</Button>
      </Form>
    </div>
  );
};
