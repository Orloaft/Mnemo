import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import React from "react";
import { MainView } from "../components/MainView";
import { ShootingStarView } from "../components/ShootingStarView";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ShootingStarView />
      <MainView />
    </div>
  );
};

export default Home;
