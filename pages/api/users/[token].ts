// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import knex from "knex";



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  knex("./gameUserData.db")
    .select()
    .from("users")
    .where({ token: req.query.token })
    .then((users) => {
      if (users[0]) {
        res.send(users[0]);
      } else {
        res.json({ message: "user not found" });
      }
    })
    .catch((err) => res.json(err));
}
