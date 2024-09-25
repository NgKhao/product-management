const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const SettingGeneral = mongoose.model(
  "SettingGeneral",
  settingGeneralSchema,
  "settings-general"
);

module.exports = SettingGeneral;
