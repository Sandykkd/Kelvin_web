const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
app.use(express.static("./public"));
app.set("view engine", "ejs");

const initializePassport = require("./config/passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [
  {
    id: 1598174797759,
    name: "admin",
    email: "admin@gmail.com",
    password: "admin",
  },
  2,
];
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "Sandy",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/form",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.get("/back", checkAuthenticated, function (req, res) {
  res.render("home");
});
app.use("/", checkAuthenticated, require("./routers/route_search"));
app.use("/", checkAuthenticated, require("./routers/emp_details"));
app.use("/", checkAuthenticated, require("./routers/filtering/by_date"));
app.use("/", checkAuthenticated, require("./routers/filtering/month1"));
app.use("/", checkAuthenticated, require("./routers/filtering/search_id"));
app.use("/", checkAuthenticated, require("./routers/filtering/shift"));
app.use("/", checkAuthenticated, require("./routers/filtering/search_email"));
app.use("/", checkAuthenticated, require("./routers/filtering/search_dept"));
app.use("/", checkAuthenticated, require("./routers/filtering/range"));
app.use("/", checkAuthenticated, require("./routers/add_employee"));
app.use("/", checkAuthenticated, require("./routers/history"));
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
