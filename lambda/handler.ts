import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { Client } from "pg";
let client: Client;


export async function handler() {
  const region = "us-east-1";
  try {
    const CLUSTER_ENDPOINT = process.env.CLUSTER_ENDPOINT || '';

    // The token expiration time is optional, and the default value 900 seconds
    const signer = new DsqlSigner({
      hostname: CLUSTER_ENDPOINT,
      region,
    });
    const token = await signer.getDbConnectAdminAuthToken();
    client = new Client({
      host: CLUSTER_ENDPOINT,
      user: "admin",
      password: token,
      database: "postgres",
      port: 5432,
      // <https://node-postgres.com/announcements> for version 8.0
      ssl: true
    });

    // Connect
    await client.connect();

    // Create a new table
    await client.query(`CREATE TABLE IF NOT EXISTS owner (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(30) NOT NULL,
      city VARCHAR(80) NOT NULL,
      telephone VARCHAR(20)
    )`);

    // Insert some data
    await client.query("INSERT INTO owner(name, city, telephone) VALUES($1, $2, $3)", 
      ["John Doe", "Anytown", "555-555-1900"]
    );

    // Check that data is inserted by reading it back
    const result = await client.query("SELECT id, city FROM owner where name='John Doe'");
    console.log({id: result.rows[0].id});

    await client.query("DELETE FROM owner where name='John Doe'");
    const deletedResult = await client.query("SELECT id, city FROM owner where name='John Doe'");
    console.log({deletedResult});

  } catch (error) {
    console.error(error);
    throw error
  } finally {
    client?.end()
  }
  Promise.resolve()
}