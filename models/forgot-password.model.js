const mongoose = require("mongoose");

// model dùng để lưu mã otp khi quên password
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,

    // hàm tính thời gian hết hạn trong mongose
    expireAt: { 
      type: Date,
      expires: 180, // thời gian tồn tại là 3 minute
    },
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const forgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = forgotPassword;
