
// Button status
const buttonStatus = document.querySelectorAll("[button-status]");

if(buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if(status) {
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");

            }

            console.log(url.href);
            window.location.href = url.href;
        });
    });
}

// End Button Status

// Form search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword) {
            url.searchParams.set("keyword", keyword);
        }else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;

    })
}
// End Form Search

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]"); //thuộc tính tự định nghĩa thì thêm []
if(buttonPagination) {
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            console.log(page);

            url.searchParams.set("page", page);

            window.location.href = url.href;

        });
    });
}
// End Pagination

// Check Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {//check xem checkbox đã tích hay chưa
            inputsId.forEach(input => {
                input.checked = true;
            });
        }else {
            inputsId.forEach(input => {
                input.checked = false;
            });           
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            // đếm những ô checkbox đã check
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            
            // console.log(countChecked);

            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;

            }
        });
    });

}
//End Check Multi


// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); //ngăn sự kiện load lại trang của submit

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked" //dùng name mà không dùng value vì mỗi value là 1 id, 
            // kia là cứng name='id'
        );

        if(inputsChecked.length > 0) {
            let ids = [];
            
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });

            inputIds.value = ids.join(", ");//chuyển thành String

            formChangeMulti.submit();
        }else {
            alert("Vui long chon it nhat mot ban ghi");
        }

    });


}
// End Form Change Multi

