import { uuid } from "uuidv4";
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./gameUserData.db",
  },
  useNullAsDefault: true,
});
export default function handler(req, res) {
  let token = uuid();
  knex("users")
    .select()
    .where({ name: req.body.name })
    .then((user) => {
      if (user.length === 0) {
        knex("users")
          .insert({
            token: token,
            name: req.body.name,
            data: JSON.stringify({
              xp: 0,
              lvl: 1,
              knownSpells: [{ name: "missle", lvl: 1 }],
              image: Math.floor(Math.random() * 10),
            }),
          })
          .then(() => {
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
                  image: Math.floor(Math.random() * 10),
                });
              });
          });
      } else {
        res.json({ message: "name taken" });
      }
    });
}
