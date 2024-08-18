//permissions
// lấy id vào các permisssion của id đó đưa vào 1 obj và chuyển thành JSON 
// sau đó submit bằng form

const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermission.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name"); // lấy ra "id" trong data-name
      const inputs = row.querySelectorAll("input");
      // console.log(inputs);

      if (name == "id") {
        // lấy ra các id của quyền
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;

          // console.log(name);
          // console.log(index);
          // console.log(checked);
          // console.log("-----------");

          if(checked){
            // push vào mảng permissions trong mảng permissions 
            permissions[index].permissions.push(name);
          }
        })
      }
    });
    console.log(permissions);

    if(permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
      inputPermissions.value = JSON.stringify(permissions); // chuyển array -> JSON sau đó gán vào input
      formChangePermissions.submit();
    }
  });
}
//End  permissions


// Permissions Data Default
// tick vào các ô sau khi đã updata DB 

const dataRecords = document.querySelector("[data-records]")
// console.log(dataRecords);
if(dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  // console.log(records);

  const tablePermissions = document.querySelector("[table-permissions]");

  records.forEach((record, index) => {
    const permissions = record.permissions;
    // console.log(permissions);

    permissions.forEach(permission => {
      // console.log(permission);
      // console.log(index);

      //query ra cái hàng data-name = permission
      const row = tablePermission.querySelector(`[data-name="${permission}"]`);

      // queryAll để lấy 1 mảng các ô input trong hàng
      // sau đó arr[index] để lấy ra 1 ô tại index
      const input = row.querySelectorAll("input")[index];

      input.checked = true;
    })
  })
}
// End Permissions Data Default

