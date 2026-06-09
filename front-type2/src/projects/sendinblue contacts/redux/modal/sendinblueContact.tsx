import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class TaskClass extends backend {
  listContactList(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`sendinblue/${query.slug}/listContactlist${str}`);
  }
  listContact(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`sendinblue/${query.slug}/listContacts${str}`);
  }
  getFormFields(query, data) {
    return this.post(`template/${query.slug}/getFieldsOfPdf`, data);
  }
  createSendinblueConntact(query, data) {
    return this.post(`sendinblue/${query.slug}/createContact`, data);
  }
  deleteContact(query, data) {
    return this.post(`sendinblue/${query.slug}/deleteContact`,data);
  }
  viewContact(query, data) {
    return this.post(`sendinblue/${query.slug}/viewContact`,data);
  }
  editContact(query, data) {
    return this.post(`sendinblue/${query.slug}/updateContact`, data);
  }
})();
