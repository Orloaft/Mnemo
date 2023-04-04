import { NextApiRequest, NextApiResponse } from "next";
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./gameUserData.db",
  },
  useNullAsDefault: true,
});
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  knex("pendingCredentials")
    .select()
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
