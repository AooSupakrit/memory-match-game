import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function checkAndTruncateData() {
  try {
    const [rows] = await connection.execute(`SELECT COUNT(*) AS count FROM leaderboard`);
    const rowCount = rows[0].count;
    const maxRowCount = 5;

    if (rowCount >= maxRowCount) {
      await connection.execute(`TRUNCATE TABLE leaderboard`);
      console.log("Table truncated successfully.");
    } else {
      console.log("Table does not exceed the max row count.");
    }
  } catch (err) {
    console.error("Error checking or truncating table:", err);
  }
}

connection.connect().then(() => {
  console.log("Connected to the database");
  checkAndTruncateData();
}).catch(err => {
  console.error("Error connecting to database:", err.stack);
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const [results] = await connection.query("SELECT * FROM leaderboard");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err });
  }
});

app.post("/api/leaderboard", async (req, res) => {
  const { player_name, score } = req.body;
  try {
    const [result] = await connection.query("INSERT INTO leaderboard (player_name, score) VALUES (?, ?)", [player_name, score]);
    res.json({ message: "Score saved successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error saving score", error: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
