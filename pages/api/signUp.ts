import knex from "knex";

export default function handler(req, res) {
  knex("./db.sqlite3")
    .select()
    .from("users")
    .where({ email: req.body.email })
    .then((email) => {
      if (email.length !== 0) {
        res.json({ message: "email taken" });
      } else {
        knex("./db.sqlite3")
          .select()
          .from("users")
          .where({ name: req.body.name })
          .then((user) => {
            if (user.length === 0) {
              knex("./db.sqlite3")
                .insert({
                  name: req.body.name,
                  password: req.body.password,
                  email: req.body.email,
                })
                .into("users")
                .then((newUserId) => {
                  console.log("Insert Response: ", newUserId);
                  res.status(201).json({ message: "new user created" });
                })
                .catch(() =>
                  res.status(400).json({
                    message: `Error creating user ${req.body.name}`,
                  })
                );
            } else {
              res.json({ message: `username taken` });
            }
          });
      }
    });
}
