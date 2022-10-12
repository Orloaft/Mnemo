import knex from "knex";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  knex("./gameUserData.db")
    .select()
    .from("pendingCredentials")
    .where({ token: req.body.token })
    .then((credentialsGroup) => {
      console.log(credentialsGroup);
      res.status(200).json({ ...credentialsGroup[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ ...err });
    });
}
