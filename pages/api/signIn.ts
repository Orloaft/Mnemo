import knex from "knex";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";

export default function handler(req, res) {
  knex("./gameUserData.db")
    .select()
    .from("users")
    .where({ email: req.body.email })
    .then((users) => {
      if (users.length === 0) {
        res.json({ message: "user does not exist" });

      } else {
        bcrypt.compare(req.body.password,users[0].password, function(err, result) {
          if (result) { 
          let token = uuid();
            knex("./gameUserData.db")
              .update({ token: token })
              .from("users")
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
          });

      }
    });
}
