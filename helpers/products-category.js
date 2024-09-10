const ProductCategory = require("../models/product-category.model")

// lấy ra các danh mục cấp con
module.exports.getSubCategory = async (parentId) => {
  // tạo hàm để đệ quy đc
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
  
    let allSub = [...subs];
    //[...subs]: tạo 1 bản sao của subs, allSub và subs là 2 mảng khác nhau trong trong bộ nhớ
    // allSub = subs: tham chiếu đến cùng 1 arr trong bộ nhớ, nếu change allSub thì subs cũng thay đổi
  
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs); //nối các arr lại
    }
    return allSub;
  }

  const result = await getCategory(parentId);
  return result;
};
