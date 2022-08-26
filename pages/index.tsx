import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect } from "react";
import { MainView } from "../components/MainView";
import { ShootingStarView } from "../components/ShootingStarView";
import SocketService from "../SocketService";

const Home: NextPage = () => {
  useEffect(() => {
    SocketService.connect();
  }, []);
  return (
    <div className={styles.container}>
      <ShootingStarView />
      <MainView />
    </div>
  );
};

export default Home;
