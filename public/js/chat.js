//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    // content của thuộc tính name
    const content = e.target.elements.content.value;

    if(content) {
      socket.emit("CLIENT_SEND_MESSAGE", content); //client phát data
      e.target.elements.content.value = "";
    }
  })
} 
//END CLIENT_SEND_MESSAGE
