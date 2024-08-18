const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
