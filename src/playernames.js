const mysql = require('mysql');
const express = require('express');
const app = express();

// Set up connection to database.
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'me',
  password: 'secret',
  database: 'my_db',
});

app.post('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query('CREATE TABLE IF NOT EXISTS tbl_userscore(id INT PRIMARY KEY, username letCHAR[40], userscore INT)');
    let postData = req.data;
    let userName = postData.name;
    let userScore = postData.score;
    connection.query("INSERT INTO tbl_userscore (username,userscore) VALUES ('" + userName + "','" + userScore + "')", function(err, rows) {
      if (rows.affectedRows) {
        connection.query("SELECT * FROM products WHERE id='" + rows.insertId + "' LIMIT 1", function(err, rows) {
          if (!err && rows.length > 0) {
            res.json(rows[0]);
          }
          else{
            res.json([]);
          }
        });
      }
    });
  });
});
