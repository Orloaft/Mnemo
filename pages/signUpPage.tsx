import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { SignUpPageView } from "../components/SignUpPageView";

export default function SignUpPageController() {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const handleChange = (e, name) => {
    let newForm = { ...form };
    newForm[name] = e.target.value;
    setForm(newForm);
  };

  const [message, setMessage] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    await axios
      .post(`/api/signUp`, {
        email: form.email,
        name: form.name,
        password: form.password,
      })
      .then((result) => {
        setMessage(result.data.message);
        setForm({ email: "", name: "", password: "" });
        if (result.data.message === "confirmation sent") {
          // router.push(`/email/${result.data.email}`);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <SignUpPageView
      onChange={handleChange}
      form={form}
      submit={submitHandler}
      message={message}
    />
  );
}
