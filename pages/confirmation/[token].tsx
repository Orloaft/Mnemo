import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Frame } from "../../components/CharacterView";
import { LoadButton } from "../../components/mainMenu/MainView";
import { ShootingStarView } from "../../components/ShootingStarView";
import styles from "../../styles/Home.module.css";

export default function ConfirmationPageController(props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  let router = useRouter();
  const handleConfirm = () => {
    console.log("creating account", router.query.token);
    axios
      .post(`/api/pendingCredentials/${router.query.token}`, {
        token: router.query.token,
      })
      .then((res) => {
        console.log(res.data);
        axios
          .post(`/api/accounts/create`, {
            credentials: res.data,
          })
          .then((res) => {
            if (res.data.message === "account created") {
              setIsConfirmed(true);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <ShootingStarView />
      {(isConfirmed && (
        <>
          <Frame>Your email has been confirmed</Frame>
          <Frame>
            <Link href="/">back</Link>
          </Frame>
        </>
      )) || (
        <>
          <LoadButton style={{ zIndex: "4" }} onClick={handleConfirm}>
            confirm your email
          </LoadButton>
        </>
      )}
    </div>
  );
}
