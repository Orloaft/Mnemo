import React from "react";
import { uuid } from "uuidv4";
import SocketService from "../../SocketService";

import EnemyCell from "./EnemyCell";

const EnemyView = ({ enemies, id }) => {
 
  const getHandleEnemyClick = (i) => {
    return () => {
      SocketService.update({
        type: "enemyClicked",
        targetIndex: i,
        id: id,
      });
    };
  };
  return (
    <div
      key={uuid()}
      style={{
        display: "flex",
        gap: ".1rem",

        width: "100%",
      }}
    >
      {enemies.map((enemy, i) => {
        return (
          <EnemyCell
            key={i}
            enemy={enemy}
            handleClick={getHandleEnemyClick(i)}
            i={i}
          />
        );
      })}
    </div>
  );
};
export default React.memo(EnemyView);
