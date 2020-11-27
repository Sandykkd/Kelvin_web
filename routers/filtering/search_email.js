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
    database: "kelvin2",
  });
}

router.post("/search_email", function (req, res) {
  var response = {
    date_input: req.body.search_email,
  };
  //console.log("search email" + " " + response);
  req.session.context = req.body.search_email;
  res.redirect("/search_email_id");
  res.end(JSON.stringify(response));
});
router.get("/search_email_id", function (req, res) {
  var search_input = req.session.context;
  //search_input  = Number(search_email);
  // console.log("type" + " " + typeof search_input);
  //	console.log(search_id);
  var personList = [];

  var connection = getMySQLConnection();
  connection.connect();
  var l = [
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
    search_input,
  ];
  c = 0;
  for (i = 0; i < l.length; i++) {
    c = c + 1;
  }
  //console.log(c);
  connection.query(
    "select * from temp_jan where email=? union select * from temp_feb  where email=? union select * from temp_mar where email=? union select * from temp_apr where email=? union select * from temp_may where email=? union select * from temp_jun where email=? union  select * from temp_jul where email=? union select * from temp_aug where email=? union select * from  temp_sep where email=? union select * from temp_oct where email=? union select * from temp_nov where email=? union select * from temp_dec where email=? order by time;",
    [
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
      search_input,
    ],
    function (err, rows, fields) {
      //connection.query("(select * from temp_jan where uid=?) union (select * from temp_feb where uid=?)",[search_input,search_input], function (err, rows, fields) {

      if (err) {
        res.status(500).json({
          status_code: 500,
          status_message: "internal server error 5",
        });
      } else {
        for (var i = 0; i < rows.length; i++) {
          var t = rows[i].checkin;
          var str = t.toString();
          var s = str.split(" ", 5);

          var t1 = rows[i].checkout;
          var str1 = t1.toString();
          var s1 = str1.split(" ", 5);

          //console.log(s);

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
        //	res.end(JSON.stringify(personList));
        //res.end(personList);
        res.render("filter", {
          result: true,
          personList: personList,
        });
      }
    }
  );

  connection.end();
});

module.exports = router;
