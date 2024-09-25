const SettingGeneral = require("../../models/settings-general.model")

// đưa logo đã update trong setting general trong admin cập nhập vào toàn bộ trong client 
module.exports.settingGeneral = async(req, res, next) => {
  const settingGeneral = await SettingGeneral.findOne({});

  // chuyển thành toàn cục để dùng full trong client
  res.locals.settingGeneral = settingGeneral;

  next();
}