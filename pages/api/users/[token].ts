// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import knex from "knex";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  knex("./gameUserData.db")
    .select()
    .from("users")
    .where({ token: req.query.token })
    .then((users) => res.json(JSON.parse(users[0].data)))
    .catch((err) => res.json(err));
}
