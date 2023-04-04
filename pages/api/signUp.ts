import nodemailer from "nodemailer";
import { uuid } from "uuidv4";
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./gameUserData.db",
  },
  useNullAsDefault: true,
});

// compares chosen name and email against user table in db, returns message if taken or sends email with confirmation link
export default function handler(req, res) {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
    secure: true,
  });

  knex("users")
    .select()
    .where({ email: req.body.email })
    .then((email) => {
      if (email.length !== 0) {
        res.json({ message: "email taken" });
      } else {
        knex("users")
          .select()
          .where({ name: req.body.name })
          .then((user) => {
            if (user.length === 0) {
              // if no user with the name or email exists in db then a token will be created and attached to the email set to expire in 300 sec
              let authToken = uuid();
              const mailData = {
                from: process.env.USER_EMAIL,
                to: req.body.email,
                subject: `Message From ${process.env.USER_EMAIL}`,
                text: `hello ${req.body.name}!
              Use this url to confirm your email ${process.env.HOST}/confirmation/${authToken}.`,
              };
              knex("pendingCredentials")
                .insert({ ...req.body, token: authToken })
                .then(() => {
                  transporter.sendMail(mailData, function (err, info) {
                    if (err) console.log(err);
                    else {
                      res.status(200).json({
                        message: "confirmation sent",
                        email: req.body.email,
                      });
                    }
                  });
                })
                .catch((err) => console.log(err));
            } else {
              res.json({ message: `username taken` });
            }
          });
      }
    });
}
