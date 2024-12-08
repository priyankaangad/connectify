require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ananya',
  database: 'connectify_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM jobs', (err, results) => {
  if (err) throw err;
  console.log(results);
});

module.exports = connection;