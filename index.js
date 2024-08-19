import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDataBase} from "./config/db.js";
import api from "./api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3032;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is Running");
});

// Connect to the database
connectDataBase();

// Register all routes from api.js
app.use("/api", api);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
