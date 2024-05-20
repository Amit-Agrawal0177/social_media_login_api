const mysql = require('mysql');
//const dbConfig = require('./dbcofig');
// const dbConfig = require("./connection");
const dbConfig = {
  connectionLimit:10,
  host: "localhost",
  user: "root",
  password: "root1234",
 database:"practice",
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err,connection) => {
    if (err) {
      throw err;
    }
    console.log('MySQL pool Created');
    connection.release();
  });
  
module.exports = pool;