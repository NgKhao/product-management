const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/fillterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex;

    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );
    // End Pagination


    const products = await Product.find(find)
        .sort({ position: "desc"}) //truyền obj sau đó là desc hoặc asc
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    // console.log(products)

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    // chờ update xong mới phản hồi lại giao diện
    await Product.updateOne({_id:id}, {status: status});

    req.flash('success', 'Cập nhật trạng thái thành công!');

    // chuyển hướng về trang trước
    res.redirect("back");
}   

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);

    const type = req.body.type;
    const ids = req.body.ids.split(", "); //chuyển String to Array

    switch (type) {
        // { $in: ids}: update nhiều id
        case "active":
            await Product.updateMany({_id: { $in: ids}}, { status: "active"});
            req.flash("success", `Cập nhập thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id: { $in: ids}}, { status: "inactive"});
            req.flash("success", `Cập nhập thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "delete-all": //xóa mềm các sp được chọn 
            await Product.updateMany({_id: { $in: ids}}, 
                {
                    deleted: true,
                    deleteAt: new Date(),
                });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);

            break;
        case "change-position": // thay đổi và sắp xếp vị trí từ cao đến thấp
            for (const item of ids) {

                // đầu tiên dùng split chuyển String thành Array ngăn cách bỏi -
                // sau đó dùng destructuring để gán
                let [id, position] = item.split("-");
                position = parseInt(position);

                // console.log(id);
                // console.log(position);

                await Product.updateOne(
                    {_id: id}, 
                    { position: position}
                );
            }
            req.flash("success", `Đổi vị trí thành công ${ids.length} sản phẩm`);

            break;
        default:
            break;
    }

    // console.log(type);
    // console.log(ids);
    res.redirect("back");

}  

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;

    // xóa vĩnh viễn
    // await Product.deleteOne({_id:id});

    // xóa mềm
    await Product.updateOne(
        {_id: id}, 
        {
            deleted: true,
            deleteAt: new Date()
        }
    );

    req.flash("success", `Đã xóa thành công sản phẩm`);

    // chuyển hướng về trang trước
    res.redirect("back");
}   