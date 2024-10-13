import { createPool } from "mysql2/promise";

export async function connect() {
  const connection = createPool({
    // host: "bo8yioelucnyneouuyof-mysql.services.clever-cloud.com",
    // user: "uzmp52tau5tlkfqt",
    // port: 3306,
    // database: "bo8yioelucnyneouuyof",
    // password: "eZeGT8C5JWTINxNB9Wr7",
    // host: "localhost",
    // user: "root",
    // port: 3306,
    // database: "corpocesar",
    // password: "1065828184",
  });
  return connection;
}
