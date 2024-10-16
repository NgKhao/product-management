const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;
