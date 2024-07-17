// cấu hình express
const express = require("express");
require("dotenv").config();

const database = require("./config/database");

const routeAmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// app Locals Variables
app.locals.prefixAmin = systemConfig.prefixAmin;

app.use(express.static("public"));

// Routes
routeAmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
