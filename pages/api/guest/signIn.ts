import knex from "knex";
import { uuid } from "uuidv4";

export default function handler(req, res) {
  knex("./gameUserData.db")
    .select()
    .from("users")
    .where({ name: req.body.name })
    .then((user) => {
      if (user.length === 0) {
        knex("./gameUserData.db")
          .insert({
            name: req.body.name,
            data: JSON.stringify({
              xp: 0,
              lvl: 1,
              knownSpells: [{ name: "missle", lvl: 1 }],
            }),
          })
          .into("users")
          .then(() => {
            let token = uuid();
            knex("./gameUserData.db")
              .update({ token: token })
              .from("users")
              .where({ name: req.body.name })
              .then(() => {
                res.json({
                  token: token,
                  message: "signed in succesfully",
                  name: req.body.name,
                  knownSpells: [{ name: "missle", lvl: 1 }],
                });
              });
          });
      } else {
        res.json({ message: "name taken" });
      }
    });
}
