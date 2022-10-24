import { useEffect, useState } from "react";
import axios from "axios";
import { Frame } from "./CharacterView";
export const UserData = () => {
  const [data, setData] = useState(null);
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
  return <Frame>{data && data.lvl}</Frame>;
};
