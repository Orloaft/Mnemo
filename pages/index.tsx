import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, createContext, useState } from "react";
import { MainView } from "../components/mainMenu/MainView";
import { ShootingStarView } from "../components/ShootingStarView";
import SocketService from "../SocketService";
export const UserContext = createContext({
  user: { name: "" },
  setUser: null,
});
const Home: NextPage = () => {
  const [credentials, setCredentials] = useState({ name: "" });
  useEffect(() => {
    SocketService.connect();
  }, []);
  return (
    <UserContext.Provider
      value={{ user: credentials, setUser: setCredentials }}
    >
      <div className={styles.container}>
        <ShootingStarView />
        <MainView />
      </div>
    </UserContext.Provider>
  );
};

export default Home;
