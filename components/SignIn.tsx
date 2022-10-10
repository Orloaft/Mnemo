import Link from "next/link";
import { useState } from "react";
import { Frame } from "./CharacterView";

export const SignIn = ({ logIn }) => {
  const [nameInput, setNameInput] = useState("");
  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  };
  return (
    <Frame>
      <form>
        <input
          onChange={(e) => {
            handleNameChange(e);
          }}
          placeholder="username"
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (nameInput.length > 4) {
              window.localStorage.setItem("username", nameInput);
              logIn();
            } else {
              alert("please use at least 5 characters");
            }
          }}
        >
          sign in
        </button>
      </form>
      <Link href="/signUpPage">Sign up</Link>
    </Frame>
  );
};
