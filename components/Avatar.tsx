import React from "react";
import styled from "styled-components";
import placeHolder from "../public/placeholder.png";

const Name = styled.div`
  font-size: 1rem;

  color: #ffebcd;
`;
const Frame = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Avatar = () => {
  return (
    <Frame>
      <img
        src={placeHolder.src}
        alt="placeholder"
        style={{ height: "5rem", width: "5rem" }}
      ></img>
      <Name>{localStorage.getItem("username")}</Name>
    </Frame>
  );
};
