const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  // vì collection này chỉ có 1 record nên findOne là lấy ra cái đầu tiên
  const setttingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setttingGeneral: setttingGeneral,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  // vì collection này chỉ có 1 record nên findOne là lấy ra cái đầu tiên
  const settingGeneral = await SettingGeneral.findOne({});
  
  // nếu đã có rồi thì update, nc lại thì tạo mới
  if (settingGeneral) {
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  req.flash("success", "Cập nhật thành công!");

  res.redirect("back");
};
