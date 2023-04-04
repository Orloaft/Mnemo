import bcrypt from "bcrypt";
import { uuid } from "uuidv4";
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./gameUserData.db",
  },
  useNullAsDefault: true,
});
export default function handler(req, res) {
  knex("users")
    .select()
    .where({ email: req.body.email })
    .then((users) => {
      if (users.length === 0) {
        res.json({ message: "user does not exist" });
      } else {
        bcrypt.compare(
          req.body.password,
          users[0].password,
          function (err, result) {
            if (result) {
              let token = uuid();
              knex("users")
                .update({ token: token })
                .where({ name: users[0].name })
                .then(() => {
                  res.json({
                    token: token,
                    message: "signed in succesfully",
                    name: users[0].name,
                    knownSpells: JSON.parse(users[0].data).knownSpells,
                  });
                });
            } else {
              res.json({ message: "incorrect password" });
            }
          }
        );
      }
    });
}
