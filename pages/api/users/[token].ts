// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./gameUserData.db",
  },
  useNullAsDefault: true,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  knex("users")
    .select()
    .where({ token: req.query.token })
    .then((users) => {
      if (users[0]) {
        res.send(users[0]);
      } else {
        res.send({ message: "user not found" });
      }
    })
    .catch((err) => res.send(err));
}
