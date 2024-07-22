// cấu hình express
const express = require("express");
const methodOverride = require("method-override"); // thêm thư viện này để thay GET form thành PATCH
const bodyParser = require('body-parser') //thêm thư viện body parser để nhận đc data gửi lên
require("dotenv").config();

const database = require("./config/database");

const routeAmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

// thêm thư viện này để thay GET form thành PATCH
app.use(methodOverride("_method"));

// thêm thư viện body parser để nhận đc data gửi lên
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

// app Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

// Routes
routeAmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
