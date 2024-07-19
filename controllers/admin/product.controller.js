const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/fillterStatus");

// [GET] /admin/products

module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    }

    let keyword = "";
    if(req.query.keyword) {
        keyword = req.query.keyword;

        // regex in js
        const regex = new RegExp(keyword, "i"); // String i để ko phân biệt hoa và thường
        find.title = regex;
    }

    const products = await Product.find(find);

    // console.log(products)

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
};