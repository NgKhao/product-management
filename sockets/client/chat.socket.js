const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = async (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      // console.log(data.images);

      let images = [];
      // chuyển buffer thành link ảnh onl
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // save into db
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Phát data từ server về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    // giao tiếp dùng khi typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      // trả về cho các client khác
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
};
