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
const User = styled.div`
  animation: ${emerge};
  animation-duration: 0.5s;
  animation-iteration-count: once;
  animation-timing-function: linear;
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
    <div style={{display:"flex", zIndex:"3", justifyContent:"space-between",gap:"1rem"}}>
    {data && <img
    style={{height: "25rem", width: "auto", position:"absolute", left:"20%", top:"10%"}}
     src={`space-wizard${data.image}.jpg`}
   />}
    <User
      style={{
        position: "absolute",
        top: "10%",
        display: "flex",
        flexDirection: "column",
        gap: "5%",
        height: "50%",
      }}
      
    >
   
  
      <Frame style={{ display: "flex", width: "100%", height: "20rem" }}>
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

            width: "50%",
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
    </User>
    </div>
  );
};
