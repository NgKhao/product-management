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


    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

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

    // chuyển hướng về trang trước
    res.redirect("back");
}   

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    console.log(req.body);

    const type = req.body.type;
    const ids = req.body.ids.split(", "); //chuyển String to Array

    switch (type) {
        case "active":
            await Product.updateMany({_id: { $in: ids}}, { status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: { $in: ids}}, { status: "inactive"});
            break;
        default:
            break;
    }

    console.log(type);
    console.log(ids);
    res.redirect("back");

}  