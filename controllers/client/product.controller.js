const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET]/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc"}) //truyền obj sau đó là desc hoặc asc

    const newProduct = productsHelper.priceNewProducts(products);

    // console.log(newProduct[0]);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProduct
    });
}

// [GET]/products/:slug
module.exports.detail = async (req, res) => {
    // try cacth để khi user chỉnh sửa trên id trên tên miền sẽ không bị die 
    try{
        const find = {
            deleted: false,
            slug: req.params.slug, //lấy được id trên miền
            status: "active"
        }

        const product = await Product.findOne(find);

        // console.log(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`);
    }
}