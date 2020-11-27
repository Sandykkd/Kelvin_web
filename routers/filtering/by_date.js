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

router.post("/by_date", urlencodedParser, function (req, res) {
  req.session.context = req.body.date;
  res.redirect("/date");
  //res.end(JSON.stringify(response));
});

router.get("/date", function (req, res) {
  var context = req.session.context;
  console.log("Query date" + " " + context);
  var month = context.split("-");
  var mon = month[1];
  var mth = Number(mon);
  var date1 = month[2];
  var cur_date = Number(date1);
  console.log("Split date" + " " + cur_date);
  var cur_month;
  switch (mth) {
    case 1:
      cur_month = "temp_jan";
      break;
    case 2:
      cur_month = "temp_feb";
      break;
    case 3:
      cur_month = "temp_mar";
      break;
    case 4:
      cur_month = "temp_apr";
      break;
    case 5:
      cur_month = "temp_may";
      break;
    case 6:
      cur_month = "temp_jun";
      break;
    case 7:
      cur_month = "temp_jul";
      break;
    case 8:
      cur_month = "temp_aug";
      break;
    case 9:
      cur_month = "temp_sep";
      break;
    case 10:
      cur_month = "temp_oct";
      break;
    case 11:
      cur_month = "temp_nov";
      break;
    case 12:
      cur_month = "temp_dec";
      break;
  }
  //console.log(cur_month);

  var personList = [];
  var value = cur_month;
  //console.log(value);
  list = [
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
  for (i = 0; i < list.length; i++) {
    if (list[i].match(value)) {
      console.log("1st for");
      console.log(value);
      var connection = getMySQLConnection();
      connection.connect();

      connection.query(
        "SELECT * FROM ?? order by checkin",
        value,
        function (err, rows, fields) {
          if (err) {
            console.log(err + " " + 1);
            res.status(500).json({
              status_code: 500,
              status_message: "internal server error 1",
            });
          } else {
            for (var i = 0; i < rows.length; i++) {
              console.log("for");
              var t = rows[i].checkin;
              var str = t.toString();
              var s = str.split(" ", 5);

              var t1 = rows[i].checkout;
              var str1 = t1.toString();
              var s1 = str1.split(" ", 5);

              var day = s[0];
              var month = s[1];
              var date = s[2];
              console.log(db_date);
              var db_date = Number(date);
              if (cur_date == db_date) {
                console.log("if");
                var person = {
                  uid: rows[i].uid,
                  checkin: s,
                  checkout: s1,
                  temperature: rows[i].temperature,
                  distance: rows[i].distance,
                  shift: rows[i].shift,
                };
                personList.push(person);
              } else {
                console.log("Your Date is not found");
              }

              console.log(personList);
            }
            //res.end(JSON.stringify(personList));
            //res.end(personList);
            res.render("filter", {
              result: true,
              personList: personList,
            });
          }
        }
      );

      connection.end();
    }
  }
});

module.exports = router;
