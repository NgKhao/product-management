const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/fillterStatus");
const searchHelper = require("../../helpers/search");

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
    let objectPagination = {
        currentPage: 1,
        limitItem: 4
    }

    if(req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }

    // công thức tính index sp  bắt đầu của trang được chọn
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/objectPagination.limitItem); //làm tròn lên
    objectPagination.totalPage = totalPage;

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