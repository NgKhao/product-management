// cấu hình express
const express = require("express");
const path = require("path"); // cần cho TinyMCE
const methodOverride = require("method-override"); // thêm thư viện này để thay GET form thành PATCH
const bodyParser = require("body-parser"); //thêm thư viện body parser để nhận đc data gửi lên
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash"); // thêm tvien thông báo
const moment = require("moment"); // convert String to Date
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

// thêm thư viện body parser để nhận đc data gửi lên, khai báo trước route
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// app.set("views", "./views");
// khi deploy onl sẽ không hiểu folder views
// nên phải trỏ từ folder gốc là __dirname
app.set("views", `${__dirname}/views`);

app.set("view engine", "pug");

// Flash
app.use(cookieParser("Asu"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// TinyMCE: thư viện để chỉnh sửa định dạng soạn thảo văn bản
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// app Locals Variables
// chỉ dùng được toàn trong toàn bộ file pug còn trong js phải request mới dùng đc
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// app.use(express.static("public")); // chỉ link trong pug
app.use(express.static(`${__dirname}/public`)); // khi deploy onl sẽ không hiểu folder public
// nên phải trỏ từ folder gốc là __dirname

// Routes
routeAmin(app);
route(app);

// "*": những case nhập route không tồn tại sẽ ra 404
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
