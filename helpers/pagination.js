module.exports = (objectPagination, query, countProducts) => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    // công thức tính index sp  bắt đầu của trang được chọn
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const totalPage = Math.ceil(countProducts/objectPagination.limitItem); //làm tròn lên
    objectPagination.totalPage = totalPage;

    return objectPagination;
}