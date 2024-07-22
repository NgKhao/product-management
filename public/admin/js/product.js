// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    console.log(path);

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", ()=> {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inative" : "active";
    
            // console.log(statusCurrent);
            // console.log(id);
            // console.log(statusChange);

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            // thêm ?_method=PATCH trong npm method overide để thay get thành patch

            // console.log(action);
            formChangeStatus.action = action;

            // submit form
            formChangeStatus.submit();
        })
    });
}

// End Change status

