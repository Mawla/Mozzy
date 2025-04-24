console.log("Script starting...");
require("dotenv").config();
const fs = require("fs");
const { Pool } = require("pg");

// Read the seed file
const seedSql = fs.readFileSync("./supabase/seed.sql", "utf8");

// Extract database URL from command line arguments
const getDbUrl = () => {
  const dbUrlArg = process.argv[2];
  if (!dbUrlArg) {
    throw new Error(
      "Database connection string not provided. Please pass it as a command line argument."
    );
  }
  console.log("Using DB URL from command line argument.");
  return dbUrlArg;
};

async function runSeed() {
  let pool;
  try {
    console.log("Applying seed data to remote database...");

    // Connect to the database
    const dbUrl = getDbUrl();
    // Ensure SSL is required for remote connections
    pool = new Pool({
      connectionString: dbUrl,
      // Explicitly require SSL for Supabase
      ssl: {
        rejectUnauthorized: false, // In production, consider setting this to true with proper CA certs
        // Might need to add ca, key, cert depending on Supabase requirements
        // sslmode: 'require' // This might be handled by connectionString, but can be explicit
      },
    });

    // Start a transaction
    const client = await pool.connect();
    console.log("Database connection established.");
    try {
      await client.query("BEGIN");

      // Execute the entire seed file
      console.log("Executing seed SQL...");
      await client.query(seedSql);

      await client.query("COMMIT");
      console.log("Seed data applied successfully!");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error applying seed data:", error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error connecting or running seed:", error);
  } finally {
    if (pool) {
      await pool.end();
      console.log("Database pool closed.");
    }
  }
}

runSeed();
console.log("Script finished.");
