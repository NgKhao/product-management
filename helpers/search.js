module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    }

    if(query.keyword) {
        objectSearch.keyword = query.keyword;

        // regex in js
        const regex = new RegExp(objectSearch.keyword, "i"); // String i để ko phân biệt hoa và thường
        objectSearch.regex = regex;
    }

    return objectSearch;
}