const express = require("express");
const bodyParser = require("body-parser");
//const fileUpload = require("express-fileupload");
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

router.get("/recent_data", function (req, res) {
  var d = new Date();
  var n = d.getMonth();
  var context = n;
  // console.log("recent month");
  //var month = context.split('-');
  //var mon = month[1];
  //var mth = Number(mon);
  //console.log("Split month"+" "+month);
  var cur_month;
  var mth = n + 1;
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
      //console.log(req.params.month);
      var connection = getMySQLConnection();
      connection.connect();

      connection.query(
        "SELECT * FROM ?? order by checkin",
        value,
        function (err, rows, fields) {
          if (err) {
            console.log("internal server error 11");
            res.status(500).json({
              status_code: 500,
              status_message: "internal server error 11",
            });
          } else {
            for (var i = 0; i < rows.length; i++) {
              var t = rows[i].checkin;
              var str = t.toString();
              var s = str.split(" ", 5);

              var t1 = rows[i].checkout;
              var str1 = t1.toString();
              var s1 = str1.split(" ", 5);
              var person = {
                uid: rows[i].uid,
                checkin: s,
                checkout: s1,
                temperature: rows[i].temperature,
                distance: rows[i].distance,
                shift: rows[i].shift,
              };

              personList.push(person);
              //console.log(personList);
            }
            //res.end(JSON.stringify(personList));
            //res.end(personList);
            res.render("index", {
              personList: personList,
            });
          }
        }
      );

      connection.end();
    }
  }
});

router.get("/filter", function (req, res) {
  res.render("filter", {
    result: false,
  });
});

router.get("/form", function (req, res) {
  //Week Count
  var weekcount = 0;
  var from = new Date();
  var to = new Date();
  from.setDate(to.getDate() - 7);
  // console.log("Jumbalaka Jumbalaka");
  //console.log("Query date");
  var month = from.getMonth();
  var mon = month + 1;
  var mth = Number(mon);

  var month1 = to.getMonth();
  var mon1 = month1 + 1;
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
  from =
    from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
  to = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
  var weekQueryString = "";
  if (mth == mth1) {
    toDate = "'" + to + " 23:59:59" + "'";
    weekQueryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "' and checkin<=" +
      toDate;
  } else {
    weekQueryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "'";
    for (var i = mon; i < mon1 - 1; i++) {
      weekQueryString += " union select * from " + table_list[Number(i)];
    }
    toDate = "'" + to + " 23:59:59" + "'";
    weekQueryString +=
      " union select * from " +
      table_list[mon1 - 1] +
      " where checkin<=" +
      toDate;
  }
  // console.log(weekQueryString);

  //Month Count
  var monthcount = 0;
  var from = new Date();
  var to = new Date();
  from.setDate(to.getDate() - 30);
  //console.log("Jumbalaka Jumbalaka");
  //console.log("Query date");
  var month = from.getMonth();
  var mon = month + 1;
  var mth = Number(mon) + 1;

  var month1 = to.getMonth();
  var mon1 = month1 + 1;
  var mth1 = Number(mon1) + 1;

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
  from =
    from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
  to = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
  var monthQueryString = "";
  if (mth == mth1) {
    toDate = "'" + to + " 23:59:59" + "'";
    monthQueryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "' and checkin<=" +
      toDate;
  } else {
    monthQueryString +=
      "select * from " +
      table_list[mon - 1] +
      " where checkin>=" +
      "'" +
      from +
      "'";
    for (var i = mon; i < mon1 - 1; i++) {
      monthQueryString += " union select * from " + table_list[Number(i)];
    }
    toDate = "'" + to + " 23:59:59" + "'";
    monthQueryString +=
      " union select * from " +
      table_list[mon1 - 1] +
      " where checkin<=" +
      toDate;
  }
  // console.log(monthQueryString);

  //Todays Data and Count
  var context = new Date();
  //console.log("Query date" + context);

  var mon = context.getMonth() + 1;
  var mth = Number(mon);
  var date1 = context.getDate();
  var cur_date = Number(date1);
  //console.log("Split month" + " " + cur_date);
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
      //console.log(req.params.month);
      var connection = getMySQLConnection();
      connection.connect();

      connection.query(
        "SELECT * FROM ?? order by checkin",
        value,
        function (err, rows, fields) {
          if (err) {
            res.status(500).json({
              status_code: 500,
              status_message: "internal server error in count",
            });
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
              console.log(s + " " + s1 + " " + date);
              var db_date = Number(date);
              if (cur_date == db_date) {
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
            }
            //res.end(JSON.stringify(personList));
            //res.end(personList);
            //Month Query
            connection.query(monthQueryString, function (err, rows, fields) {
              if (err) {
                res.status(500).json({
                  status_code: 500,
                  status_message: "internal server error in monthCount",
                });
              } else {
                monthcount = rows.length;

                //Week Query
                connection.query(weekQueryString, function (err, rows, fields) {
                  if (err) {
                    res.status(500).json({
                      status_code: 500,
                      status_message: "internal server error in week",
                    });
                  } else {
                    weekcount = rows.length;
                    res.render("home", {
                      personList: personList,
                      todayCount: personList.length,
                      weekCount: weekcount,
                      monthCount: monthcount,
                    });
                  }
                });
              }
            });
          }
        }
      );

      //connection.end();
    }
  }
});

module.exports = router;
