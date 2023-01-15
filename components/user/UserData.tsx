import { useEffect, useState } from "react";
import axios from "axios";

import styled, { keyframes } from "styled-components";
import { uuid } from "uuidv4";
import { LoadButton } from "../mainMenu/MainView";
import { AbilityUpgrades } from "./AbilityUpgrades";
import { Frame } from "../LogInPanel";
const emerge = keyframes`
0%{ 
    transform: scale(0)
}
20%
{ transform: scale(.15)
}
40%
{ transform: scale(.25)
}
60%
{ transform: scale(.45)
}
80%
{ transform: scale(.75)
}
100%
{ transform: scale(1)
}
`;
const User = styled(Frame)`
  animation: ${emerge};
  animation-duration: 0.5s;
  animation-iteration-count: once;
  animation-timing-function: linear;
  display: flex;
  flex-direction: column;
  height: 100%;
  & aside {
 
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      max-height: 30%;

      align-items: center;
      padding: 1rem 0;
    }
    @media (min-width: 48rem) {
      max-height: 75%;
      & aside {
        max-height: 50%;
      }

    }
  }
`;
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
const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 3;
  height: 100%;
  & img {
    margin: 1rem;
    max-height: 40%;
    max-width: 100%;
  }
  @media (min-width: 48rem) {
    flex-direction: row;
    gap: 0.75rem;
    margin-top: 10%;
  }
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
              knownSpells: JSON.parse(res.data).knownSpells,
            })
          );
          setData(JSON.parse(res.data));
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
        setData(JSON.parse(res.data.data));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <UserContainer>
      {data && <img src={`space-wizard${data.image}.jpg`} />}
      <User>
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
        <aside className="hiddenScrollBar">
          {data && (
            <AbilityUpgrades
              level={data.lvl}
              handleLevelUp={handleLevelUp}
              knownSpells={data.knownSpells}
            />
          )}
        </aside>

        <LoadButton onClick={() => props.setShowComponent("menu")}>
          back
        </LoadButton>
      </User>
    </UserContainer>
  );
};
