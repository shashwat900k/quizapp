const bodyParser = require("body-parser");
const path = require("path");
const express= require('express');
const DIST_DIR = path.join(__dirname, "../public"),
  PORT = 3000,
  app = express();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quiz',
  port: 3306
});


app.use(bodyParser.urlencoded(
  {extended: true}));
app.use(bodyParser.json());
app.use(express.static(DIST_DIR));

function getTopTen(callback){
  connection.query("SELECT * FROM tbl_userscore ORDER BY userScore DESC,id ASC LIMIT 10",function(err,rows){
    if(!err){
      return callback(null,rows);
    }
    else
    {
      return callback(err,null);
    }
  });
}

app.get('/getTopTen',function(req,res){
  getTopTen(function(err,rows){
    if(!err){
      res.json(rows);
    }
    else
      console.log(err);
    });
  });

app.post('/postNameAndScore', function(req, res) {
  connection.query(`CREATE TABLE IF NOT EXISTS tbl_userscore
    (id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(40),
    userScore INT)`);
  let postData = req.body;
  let userName = postData.name;
  let userScore = postData.score;
  connection.query("INSERT INTO tbl_userscore(userName,userScore) VALUES (?,?)",[userName,userScore],function(err, rows) {
    if (err)
      console.log(err);
    else
      console.log(rows[0]);
  });
});

app.listen(PORT);

