import { useEffect, useState } from "react";
import axios from "axios";
import { Frame } from "./CharacterView";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { LoadButton } from "./MainView";
import { AbilityUpgrades } from "./AbilityUpgrades";

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
    if (data.xp >= data.lvl * 100) {
      axios
        .post(`/api/levelup`, {
          token: JSON.parse(localStorage.getItem("credentials")).token,
          ability: ability,
        })
        .then((res) => {
          let credentials = JSON.parse(localStorage.getItem("credentials"));
          localStorage.setItem(
            "credentials",
            JSON.stringify({
              token: credentials.token,
              name: credentials.name,
              knownSpells: res.data.knownSpells,
            })
          );
          props.setShowComponent("menu");
        })

        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    axios
      .get(
        `/api/users/${JSON.parse(localStorage.getItem("credentials")).token}`
      )
      .then((res) => {
        console.log(res);
        setData(JSON.parse(res.data.data));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30%" }}>
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
                  width: `${(data.xp / (data.lvl * 100)) * 100}%`,
                  maxWidth: "100%",
                }}
              />
            </XpBar>
          )}
          <span>known spells:</span>
          {data &&
            data.knownSpells.map((spell: { name: string; lvl: number }) => {
              return (
                <span key={uuid()}>
                  {spell.name} level: {spell.lvl}
                </span>
              );
            })}
        </div>
        <aside
          className="hiddenScrollBar"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            height: "8rem",
            width: "50%",
            gap: ".5rem",
            alignItems: "center",
            padding: "1rem 0",
          }}
        >
          {data && (
            <AbilityUpgrades
              level={data.lvl}
              handleLevelUp={handleLevelUp}
              knownSpells={data.knownSpells}
            />
          )}
        </aside>
      </Frame>
      <LoadButton onClick={() => props.setShowComponent("menu")}>
        back
      </LoadButton>
    </div>
  );
};
