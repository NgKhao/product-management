// dùng cho button-icon
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    // content của thuộc tính name
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content); //client phát data
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
//END CLIENT_SEND_MESSAGE

//SERVER RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  // Thêm khối div chứa message đã gửi ra giao diện

  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".inner-list-typing");

  const div = document.createElement("div");

  let htmlFullName = "";

  // check nếu không phải user loggin thì thên name vào
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;
  // thêm tin nhắn trước  phần typing
  body.insertBefore(div, boxTyping);

  // scroll đến cuối
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
//END_SERVER RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  // scroll đến cuối
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scroll chat to bottom

// Show Typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut); //xóa đếm 3s nếu user keyup

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//End Show Typing

// emoji-picker

// document
//   .querySelector("emoji-picker")
//   .addEventListener("emoji-click", (event) => console.log(event.detail));

// show popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// insert Icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    // đoạn code này dùng khi TH nhập đọan dài, và nhập icon sau sẽ
    // luôn đến icon chứ không trỏ về trước
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    showTyping();
  });

  // sự kiện khi user nhấn phím trên bàn phím
  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}
// end emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      // tồn tại typing(user đang nhập) thì không nữa, để tránh lặp
      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="box-typing">
            <div class="inner-name">${data.fullName} </div>
            <div class="inner-dots">
              <span> </span>
              <span> </span>
              <span> </span>
            </div>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);
        // scroll đến cuối
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      // khi div box-typing chuyển sang type hidden thì xóa
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}
// END SERVER_RETURN_TYPING
