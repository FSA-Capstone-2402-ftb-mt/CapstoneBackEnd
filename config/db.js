import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {Client} = pg;

let client;

const connectDataBase = async () => {
    if (!client) {
        client = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: {rejectUnauthorized: false},
        });

        try {
            //  Check if connected to DB
            await client.connect();
            console.log("Connected to the PostgreSQL database.");
        } catch (err) {
            console.error("Error connecting to the database:", err);
        }
    } else {
        console.log("Database client is already connected.");
    }
};

export {client, connectDataBase};
