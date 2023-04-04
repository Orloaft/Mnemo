import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
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
    .where({ token: req.body.credentials.token })
    .then((credentialsGroup) => {
      credentialsGroup[0] &&
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(credentialsGroup[0].password, salt, function (err, hash) {
            knex("users")
              .select()
              .where({ email: credentialsGroup[0].email })
              .then((email) => {
                if (email.length !== 0) {
                  res.json({ message: "email exists in database" });
                } else {
                  knex("users")
                    .insert({
                      email: credentialsGroup[0].email,
                      name: credentialsGroup[0].name,
                      password: hash,
                      data: JSON.stringify({
                        xp: 0,
                        lvl: 1,
                        image: Math.floor(Math.random() * 10),
                        knownSpells: [{ name: "missle", lvl: 1 }],
                      }),
                    })
                    .then(() => {
                      res.status(201).json({ message: "account created" });
                    })
                    .catch((err) => {
                      res.json({ ...err });
                      console.log(err);
                    });
                }
              });
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ ...err });
    });
}
