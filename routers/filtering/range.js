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

router.post("/range", urlencodedParser, function (req, res) {
  req.session.from1 = req.body.from;
  req.session.to1 = req.body.to;
  res.redirect("/range_search");
  //res.end(JSON.stringify(response));
});

router.get("/range_search", function (req, res) {
  var from = req.session.from1;
  var to = req.session.to1;

  //console.log("Query date");
  var month = from.split("-");
  var mon = month[1];
  var mth = Number(mon);

  var month1 = to.split("-");
  var mon1 = month1[1];
  var mth1 = Number(mon1);

  //console.log("Split month" + " " + mth + " " + mth1);
  var cur_month;
  table_list = [
    "temp_jan",
    "temp_feb",
    "temp_mar",
    "temp_apr",
    "temp_may",
    "temp_jun",
    "temp_jul",
    "temp_aug",
    "temp_sep",
    "temp_oct",
    "temp_nov",
    "temp_dec",
  ];

  //console.log(table_list[mon - 1] + " " + table_list[mon1 - 1]);
  var personList = [];

  var queryString = "";
  if (mth == mth1) {
    toDate = "'" + to + " 23:59:59" + "'";
    queryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "' and checkin<=" +
      toDate;
  } else {
    queryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "'";
    for (var i = mon; i < mon1 - 1; i++) {
      queryString += " union select * from " + table_list[Number(i)];
    }
    toDate = "'" + to + " 23:59:59" + "'";
    queryString +=
      " union select * from " +
      table_list[mon1 - 1] +
      " where checkin<=" +
      toDate;
  }

  //console.log(queryString);

  var connection = getMySQLConnection();
  connection.connect();
  connection.query(queryString, function (err, rows, fields) {
    //console.log("No of Rows: " + rows.length);
    if (err) {
      res
        .status(500)
        .json({ status_code: 500, status_message: "internal server error 3" });
    } else {
      for (var i = 0; i < rows.length; i++) {
        var t = rows[i].checkin;
        var str = t.toString();
        var s = str.split(" ", 5);

        var t1 = rows[i].checkout;
        var str1 = t1.toString();
        var s1 = str1.split(" ", 5);

        var day = s[0];
        var month = s[1];
        var date = s[2];
        var db_date = Number(date);

        var person = {
          uid: rows[i].uid,
          checkin: s,
          checkout: s1,
          temperature: rows[i].temperature,
          distance: rows[i].distance,
          shift: rows[i].shift,
        };

        personList.push(person);
      }
      // console.log("Jumbalaka Out");
      res.render("filter", {
        result: true,
        personList: personList,
      });
    }
  });
  connection.end();
});

module.exports = router;
