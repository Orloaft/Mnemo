import { useState } from "react";
import axios from "axios";
import { SignUpPageView } from "./SignUpView";
import { validateSignUp } from "../../utils/jsUtils";

export default function SignUpPageController(props) {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setForm({ ...form, [name]: e.target.value });
  };

  const [message, setMessage] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(validateSignUp(form));
    if (!validateSignUp(form)) {
      await axios
        .post(`/api/signUp`, {
          ...form,
        })
        .then((result) => {
          setMessage(result.data.message);
          setForm({ email: "", name: "", password: "" });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <SignUpPageView
      setStatus={props.setStatus}
      onChange={handleChange}
      form={form}
      submit={submitHandler}
      message={message}
    />
  );
}
