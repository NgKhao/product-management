// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// button go back
// buttonGoBack return 1 arr nếu có nhiều button go back
const buttonGoBack = document.querySelectorAll("[button-go-back]");
if (buttonGoBack.length > 0) {
  buttonGoBack.forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}
//End button go back