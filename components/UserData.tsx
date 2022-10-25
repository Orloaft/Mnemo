import { useEffect, useState } from "react";
import axios from "axios";
import { Frame } from "./CharacterView";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { LoadButton } from "./MainView";
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
  const [data, setData] = useState(null);

  const handleLevelUp = (ability) => {
    axios
      .post(`/api/levelup`, {
        token: JSON.parse(localStorage.getItem("credentials")).token,
        ability: ability,
      })
      .then((res) => {
        axios
          .get(
            `/api/users/${
              JSON.parse(localStorage.getItem("credentials")).token
            }`
          )
          .then((res) => {})
          .catch((err) => console.log(err));
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Frame style={{ display: "flex", width: "30rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>
            {JSON.parse(localStorage.getItem("credentials")).name} the magus
          </p>
          <span>level:{data && data.lvl}</span>
          {data && (
            <XpBar>
              <Xp
                style={{
                  width: `${data.xp}%`,
                }}
              />
            </XpBar>
          )}
          <span>known spells:</span>
          {data &&
            data.knownSpells.map((spell: string) => {
              return <span key={uuid()}>{spell}</span>;
            })}
        </div>
        <aside>
          {data && data.xp >= data.lvl * 100 && (
            <>
              <button onClick={() => handleLevelUp("heal")}>Heal</button>
              <button onClick={() => handleLevelUp("blast")}>Blast</button>
            </>
          )}
        </aside>
      </Frame>
      <LoadButton onClick={() => props.setShowComponent("menu")}>
        back
      </LoadButton>
    </div>
  );
};
