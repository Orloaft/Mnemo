import knex from "knex";

export function checkEmailInTable(email, table) {
  knex("./gameUserData.db")
    .select()
    .from(table)
    .where({ email: email })
    .then((users) => {
      if (users.length !== 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => console.log(err));
}
export function checkNameInTable(name, table) {
  knex("./gameUserData.db")
    .select()
    .from(table)
    .where({ name: name })
    .then((users) => {
      if (users.length !== 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => console.log(err));
}
export function checkPassword(password, username, table) {
  knex("./gameUserData.db")
    .select()
    .from(table)
    .where({ name: username })
    .then((users) => {
      if (users[0].password === password) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => console.log(err));
}
export function insertPendingCredentials(credentials) {
  knex("./gameUserData.db")
    .insert({ ...credentials })
    .into("pendingCredentials");
}
export function getPendingCredentials(authToken) {
  knex("./gameUserData.db")
    .select()
    .from("pendingCredentials")
    .where({ token: authToken })
    .then((credentialsGroup) => {
      return credentialsGroup[0];
    })
    .catch((err) => {
      console.log(err);
    });
  return false;
}
export function removePendingCredentials(authToken) {
  knex("./gameUserData.db")
    .delete()
    .from("pendingCredentials")
    .where({ token: authToken })
    .then(() => {
      return true;
    })
    .catch((err) => console.log(err));
}
