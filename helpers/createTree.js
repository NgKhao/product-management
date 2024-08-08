  // tạo cây để phân nhánh danh mục
let count = 0;
const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem = item;
      newItem.index = count; //thêm 1 key index để lấy vị trí
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

module.exports.tree = (arr, parentId = "") => {
  count = 0;
  const tree = createTree(arr, parentId = "");
  return tree;
}
