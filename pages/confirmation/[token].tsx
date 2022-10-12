import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    (isConfirmed && <>Your account has been created</>) || (
      <>
        <button onClick={handleConfirm}>confirm {router.query.token} </button>
      </>
    )
  );
}
