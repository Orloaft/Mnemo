import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../pages";
import { GuestView } from "./GuestView";

export const GuestController = (props) => {
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({ name: "" });
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
      .post(`/api/guest/signIn`, {
        name: form.name,
      })
      .then((result) => {
        result.data.token &&
          localStorage.setItem(
            "credentials",
            JSON.stringify({
              token: result.data.token,
              name: result.data.name,
              knownSpells: result.data.knownSpells,
              image: result.data.image,
            })
          );
        setMessage(result.data.message);
        setForm({ name: "" });
        result.data.token &&
          userContext.setUser({
            token: result.data.token,
            name: result.data.name,
          });
      })
      .catch((err) => console.log(err));
  };
  return (
    <GuestView
      setStatus={props.setStatus}
      onChange={handleChange}
      form={form}
      submit={handleSubmit}
      message={message}
    />
  );
};
