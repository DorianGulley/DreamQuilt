const { Pool } = require("pg");

// Configure the pool to connect to the DreamQuilt database
const pool = new Pool({
    user: "postgres",
    password: "admin123",
    host: "localhost",
    port: 5432,
    database: "dreamquilt" // Specify the database name
});

module.exports = pool;