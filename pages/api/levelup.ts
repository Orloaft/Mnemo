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
    .where({ token: req.body.token })
    .then((users) => {
      let data = JSON.parse(users[0].data);
      if (data.xp >= data.lvl * 100) {
        data.xp -= data.lvl * 100;
        data.lvl++;
        if (data.knownSpells.find((spell) => spell.name === req.body.ability)) {
          data.knownSpells.find((spell) => spell.name === req.body.ability)
            .lvl++;
        } else {
          data.knownSpells.push({ name: req.body.ability, lvl: 1 });
        }
        knex("users")
          .update({ data: JSON.stringify(data) })
          .where({ token: users[0].token })
          .then(() => {
            knex("users")
              .select()
              .where({ token: users[0].token })
              .then((users) => {
                res.status(201).json(users[0].data);
              });
          });
      } else {
        res.json({ message: "insufficient xp" });
      }
    })
    .catch((err) => console.log(err));
}
