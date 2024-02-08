class LedgerFeature {
  constructor(query, reqData) {
    this.query = query;
    this.reqData = reqData;
  }

  search() {
    const keyword = this.reqData?.keyword
      ? {
          partyName: {
            $regex: this.reqData.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  fetchPartyBill() {
    const partyId = this.reqData.partyId;
    this.query.find({ customerId: partyId });
    return this;
  }

  filterByDate() {
    let startDate = new Date(this.reqData.startDate);
    startDate = startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(this.reqData.endDate);
    endDate = endDate.setHours(23, 59, 59, 999);
    const filter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
    this.query.find(filter);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.reqData.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = LedgerFeature;
