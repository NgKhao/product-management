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
const http = require("http");
const { Server } = require("socket.io");

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

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io; //tạo đối tượng toàn cục

// Zalopay
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const qs = require("qs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/payment", async (req, res) => {
  const embed_data = {
    redirecturl:
      "https://product-management-koxd31pt7-nguyen-khaos-projects.vercel.app/",
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: process.env.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: 50000,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url:
      "https://759c-2405-4802-9150-1af0-9c0e-8ecd-46d2-6554.ngrok-free.app/callback",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    process.env.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, process.env.key1).toString();

  try {
    const result = await axios.post(process.env.endpoint, null, {
      params: order,
    });
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, process.env.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, process.env.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

app.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: process.env.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
  };

  let data =
    postData.app_id + "|" + postData.app_trans_id + "|" + process.env.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, process.env.key1).toString();

  let postConfig = {
    method: "post",
    url: process.env.endpoint_check,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
  }
});

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

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
