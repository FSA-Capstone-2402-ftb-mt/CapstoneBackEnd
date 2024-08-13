import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { connectDataBase } from "./config/db.js";
import api from "./api.js";
import { populateMonthWithWords } from "./models/words.js";

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

// Schedule to run once a month to pupulate months' words
cron.schedule("0 0 1 * *", async () => {
  const nextMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  ).toLocateString("default", { month: "long" });
  console.log("Populating words for the month: ", "NextMonth");
  await populateMonthWithWords(nextMonth);
});
