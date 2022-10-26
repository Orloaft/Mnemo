import axios from "axios";

import { useContext, useState } from "react";
import { UserContext } from "../pages";
import SignUpPageController from "./signUpPage";
import { Frame } from "./CharacterView";
import { Form } from "./SignUpPageView";
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
export const SignIn = (props) => {
  const [status, setStatus] = useState("sign in");
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const userContext = useContext(UserContext);
  const handleChange = (e, name) => {
    let newForm = { ...form };
    newForm[name] = e.target.value;
    setForm(newForm);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    await axios
      .post(`/api/signIn`, {
        email: form.email,
        password: form.password,
      })
      .then((result) => {
        result.data.token &&
          localStorage.setItem(
            "credentials",
            JSON.stringify({
              token: result.data.token,
              name: result.data.name,
              knownSpells: result.data.knownSpells,
            })
          );
        setMessage(result.data.message);
        setForm({ email: "", password: "" });
        result.data.token &&
          userContext.setUser({
            token: result.data.token,
            name: result.data.name,
          });
      })
      .catch((err) => console.log(err));
  };
  switch (status) {
    case "sign in":
      return (
        <Form
          style={{ alignItems: "center" }}
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Frame style={{ flexDirection: "column" }}>
            EMAIL
            <input
              value={form.email}
              onChange={(e) => {
                handleChange(e, "email");
              }}
            ></input>
            PASSWORD
            <input
              value={form.password}
              onChange={(e) => {
                handleChange(e, "password");
              }}
              type="password"
            ></input>
            {message}
          </Frame>
          <Button type="submit">sign in</Button>

          <Button onClick={() => setStatus("sign up")}>Sign up</Button>
        </Form>
      );
    case "sign up":
      return (
        <Frame>
          <SignUpPageController setStatus={setStatus} />
        </Frame>
      );
  }
};
