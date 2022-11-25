import connect from "@databases/sqlite";
import { sql } from "@databases/sqlite";
async function createDb() {
  const db = connect("./gameUserData.db");

  async function prepare() {
    await db.query(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        email VARCHAR,
        name VARCHAR NOT NULL,
        token VARCHAR,
        password VARCHAR,
        data VARCHAR
      );
    `);
    await db.query(sql`
    CREATE TABLE IF NOT EXISTS pendingCredentials (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      email VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      token VARCHAR,
      password VARCHAR
    );
  `);
  }
  const prepared = prepare();
  console.log("database connected");
}
createDb();
