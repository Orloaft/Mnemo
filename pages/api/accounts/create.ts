import knex from "knex";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  knex("./gameUserData.db")
    .select()
    .from("pendingCredentials")
    .where({ token: req.body.credentials.token })
    .then((credentialsGroup) => {
      credentialsGroup[0] &&
        knex("./gameUserData.db")
          .select()
          .from("users")
          .where({ email: credentialsGroup[0].email })
          .then((email) => {
            if (email.length !== 0) {
              res.json({ message: "email exists in database" });
            } else {
              knex("./gameUserData.db")
                .insert({
                  email: credentialsGroup[0].email,
                  name: credentialsGroup[0].name,
                  password: credentialsGroup[0].password,
                  data: JSON.stringify({
                    xp: 0,
                    lvl: 1,
                    spells: { missle: { level: 0 } },
                  }),
                })
                .into("users")
                .then(() => {
                  res.status(201).json({ message: "account created" });
                })
                .catch((err) => {
                  res.json({ ...err });
                  console.log(err);
                });
            }
          });
    })
    .catch((err) => {
      console.log(err);
      res.json({ ...err });
    });
}
