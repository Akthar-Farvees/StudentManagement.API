const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0, 
        idleTimeoutMillis: 30000 
    }
};

let poolPromise; // Store the connection pool instance

const connectDB = async () => {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(dbConfig)
            .connect()
            .then(pool => {
                console.log("✅ Connected to SQL Server");
                return pool;
            })
            .catch(err => {
                console.error("❌ Database connection failed:", err);
                process.exit(1);
            });
    }
    return poolPromise;
};

module.exports = { connectDB, sql };
