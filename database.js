require("dotenv").config();

const mysql = require("mysql2/promise");

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

database
  .getConnection()
  .then(() => {
    console.log("Connected to the database");
    // Move the code to fetch movies and users here
    fetchMovies();
    fetchUsers();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

function fetchMovies() {
  database
    .query("SELECT * FROM movies")
    .then(([movies]) => {
      console.log("Movies:", movies);
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
    });
}

function fetchUsers() {
  database
    .query("SELECT * FROM users")
    .then(([users]) => {
      console.log("Users:", users);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    });
}

module.exports = database;
