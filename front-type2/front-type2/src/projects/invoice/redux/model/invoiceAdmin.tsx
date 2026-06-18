import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class userClass extends backend {
  invoiceListApi(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`invoice${str}`);
  }

  addInvoiceApi(data) {
    return this.post(`invoice`, data);
  }

  editInvoiceApi(data) {
    return this.put(`invoice/${data._id}`, data);
  }

  deleteInvoiceApi(data) {
    return this.del(`invoice/${data}`);
  }

  getInvoiceDetailAPI(data) {
    return this.get(`invoice/${data._id}`);
  }

  getInvoiceCompanyListAPI() {
    return this.get(`invoice/from-list`);
  }

  generateInvoicePdfAPI(data) {
    return this.getPdf(`invoice/get-pdf/${data}`);
  }

})();
