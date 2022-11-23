import { useContext, useState } from "react";
import { SignInPageView } from "./SignInPageView";
import axios from "axios";
import { UserContext } from "../pages";
export const SignInPageController = (props) => {
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
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
  return (
    <SignInPageView
      setStatus={props.setStatus}
      onChange={handleChange}
      form={form}
      submit={handleSubmit}
      message={message}
    />
  );
};
