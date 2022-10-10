import connect from "@databases/sqlite";
import { sql } from "@databases/sqlite";
async function createDb() {
  const db = connect("./users.db");

  async function prepare() {
    await db.query(sql`
      CREATE TABLE IF NOT EXISTS app_data (
        id VARCHAR NOT NULL PRIMARY KEY,
        value VARCHAR NOT NULL
      );
    `);
  }
  const prepared = prepare();
  console.log("database connected");
}
createDb();
