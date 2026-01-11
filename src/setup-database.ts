import pool from "./db";

async function setupDatabase() {
  try {
    console.log("🔨 Creating tables...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        master_password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table created");

    // TODO 2: 创建 vault_items 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vault_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        website VARCHAR(255),
        username VARCHAR(255),
        encrypted_password TEXT NOT NULL,
        iv VARCHAR(32) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Vault items table created");

    console.log("🎉 Done!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
