import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class TaskClass extends backend {

  listData(data, service) {
    // console.log("Check dat---------", service)
    return this.postAPI(`admin/listData/${service}`, data);
  }
  getPdfReqAPI(data) {
    return this.postPdf(`quote/admin/getPdf`, data);
  }

  ldzFromPostcode(data) {
    return this.postAPI(`admin/ldzFromPostcode`, data);
  }

})();
