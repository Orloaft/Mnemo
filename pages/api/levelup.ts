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
      if (data.xp >= data.lvl * 100) {
        data.xp = 0;
        data.lvl++;
        switch (req.body.ability) {
          case "heal":
            data.knownSpells.push("heal");
            break;
          case "blast":
            data.knownSpells.push("blast");
        }

        knex("gameUserData.db")
          .update({ data: JSON.stringify(data) })
          .from("users")
          .where({ token: users[0].token })
          .then(() => {
            res.json({ message: "level added" });
          });
      } else {
        res.json({ message: "insufficient xp" });
      }
    })
    .catch((err) => console.log(err));
}
