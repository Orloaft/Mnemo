import axios from "axios";

import { useContext, useState } from "react";
import { UserContext } from "../pages";
import SignUpPageController from "./signUpPage";
import { Frame } from "./CharacterView";
import { Form } from "./SignUpPageView";

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
        <Frame>
          <Form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
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
            <button type="submit">sign in</button>
            {message}
            <button onClick={() => setStatus("sign up")}>Sign up</button>
          </Form>
        </Frame>
      );
    case "sign up":
      return (
        <Frame>
          <SignUpPageController setStatus={setStatus} />
        </Frame>
      );
  }
};
