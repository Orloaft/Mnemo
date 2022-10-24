import { useEffect, useState } from "react";
import axios from "axios";
import { Frame } from "./CharacterView";
import styled from "styled-components";
import { uuid } from "uuidv4";
const XpBar = styled.div`
  background: transparent;
  padding: 0.15rem;
  height: 1.5rem;
  width: 7rem;
  border: 2px solid white;
`;
const Xp = styled.div`
  -webkit-transition: width 0.3s ease;
  -o-transition: width 0.3 ease;
  transition: width 0.3 ease;
  background-color: purple;
  height: 100%;
`;
export const UserData = (props) => {
  const maxXp = 100;
  const [data, setData] = useState(null);
  const handleLevelUp = () => {
    axios
      .post(`/api/levelup`, {
        token: JSON.parse(localStorage.getItem("credentials")).token,
      })
      .then((res) => {
        console.log(res);
        props.setShowComponent("menu");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    axios
      .get(
        `/api/users/${JSON.parse(localStorage.getItem("credentials")).token}`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Frame style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{ cursor: "grab" }}
        onClick={() => props.setShowComponent("menu")}
      >
        back
      </span>
      <p>level:{data && data.lvl}</p>
      {data && (
        <XpBar>
          <Xp
            style={{
              width: `${data.xp}%`,
            }}
          />
        </XpBar>
      )}
      {data &&
        data.knownSpells.map((spell: string) => {
          return <span key={uuid()}>{spell}</span>;
        })}
      {data && data.xp >= maxXp && (
        <button onClick={handleLevelUp}>Level Up</button>
      )}
    </Frame>
  );
};
