import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class TaskClass extends backend {
  templateList(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`template/${query.slug}/list${str}`);
  }
  getFormFields(query, data) {
    return this.post(`template/${query.slug}/getFieldsOfPdf`, data);
  }
  createTemplate(query, data) {
    return this.post(`template/${query.slug}/addTemplate`, data);
  }
  deleteTemplate(query, id) {
    return this.get(`template/${query.slug}/delete/${id}`);
  }
  viewTemplate(query, id) {
    return this.get(`template/${query.slug}/view/${id}`);
  }
  editTemplate(query, data) {
    return this.post(`template/${query.slug}/update`, data);
  }
})();
