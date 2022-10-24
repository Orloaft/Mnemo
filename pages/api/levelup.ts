// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import knex from "knex";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  knex("gameUserData.db")
    .select()
    .from("users")
    .where({ token: req.body.token })
    .then((users) => {
      let data = JSON.parse(users[0].data);
      if (data.xp >= 100) {
        data.xp = 0;
        data.xp = 2;
        data.knownSpells.push("heal");
        knex("gameUserData.db")
          .update({ data: JSON.stringify(data) })
          .from("users")
          .where({ token: users[0].token })
          .then(() => {
            res.json({ message: "level added" });
          });
      }
    })
    .catch((err) => console.log(err));
}
