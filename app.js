require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5005;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const welcome = (req, res) => {
  res.send("Welcome to my favorite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.get("/api/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  pool.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  pool.query(
    "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language],
    (err, results) => {
      if (err) {
        console.error("Error inserting user into the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email, city, language } = req.body;

  pool.query(
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
    [firstname, lastname, email, city, language, userId],
    (err, results) => {
      if (err) {
        console.error("Error updating user in the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json({ message: "User updated successfully" });
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  pool.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error deleting user from the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(204).json({ message: "User deleted successfully" });
  });
});





app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});



