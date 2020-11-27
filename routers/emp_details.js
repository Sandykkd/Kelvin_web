const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
var formidable = require("formidable");
const mysql = require("mysql");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var util = require("util");
var fs = require("fs");
var mv = require("mv");
var path = require("path");
function getMySQLConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kelvin",
  });
}

router.get("/emp_details", function (req, res) {
  var personList = [];

  var connection = getMySQLConnection();
  connection.connect();
  console.log("1st end");
  connection.query(
    "SELECT * FROM employee order by uid",
    function (err, rows, fields) {
      if (err) {
        res.status(500).json({
          status_code: 500,
          status_message: "internal server error 9",
        });
      } else {
        for (var i = 0; i < rows.length; i++) {
          var person = {
            uid: rows[i].uid,
            name: rows[i].name,
            email: rows[i].email,
            gender: rows[i].gender,
            designation: rows[i].designation,
            dept: rows[i].dept,
            mobile: rows[i].mobile,
          };

          personList.push(person);
          //console.log(person);
        }
        //res.end(JSON.stringify(personList));
        //res.end(personList);
        res.render("employee", {
          personList: personList,
        });
      }
    }
  );

  connection.end();
});

module.exports = router;
