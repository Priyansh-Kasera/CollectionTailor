class ApiFeature {
  constructor(query, qureyStr) {
    this.query = query;
    this.qureyStr = qureyStr;
  }
  search() {
    const keyword = this.qureyStr.keyword
      ? {
          customerId: this.qureyStr.keyword,
        }
      : {};
    console.log("keyword", this.qureyStr.keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.qureyStr };
    // removing field from category
    const removedfields = ["keyword", "page", "limit"];
    removedfields.forEach((key) => delete queryCopy[key]);
    let queryString = { payment: { $ne: true } };
    //date filter
    if (queryCopy.startDate && queryCopy.endDate) {
      const targetStartDate = new Date(queryCopy.startDate);
      const targetEndDate = new Date(queryCopy.endDate);

      const startDate = new Date(targetStartDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(targetEndDate);
      endDate.setHours(23, 59, 59, 999);

      queryString = {
        ...queryString,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    }

    if (queryCopy.status) {
      console.log(queryCopy.status);
      queryString = { ...queryString, status: queryCopy.status.toUpperCase() };
    }

    console.log(queryString);

    // status filter

    // price filter
    //let queryString = JSON.stringify(queryCopy)
    //queryString = queryString.replace(/\b(gt|gte|lte|lt)\b/g,(key)=> `$${key}`)
    this.query = this.query.find(queryString);
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.qureyStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
module.exports = ApiFeature;
