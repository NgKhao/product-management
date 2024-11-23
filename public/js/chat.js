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
    }
  });
}
//END CLIENT_SEND_MESSAGE

//SERVER RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  // Thêm khối div chứa message đã gửi ra giao diện

  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

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
  // thêm thẻ vào cuối
  body.appendChild(div);

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
