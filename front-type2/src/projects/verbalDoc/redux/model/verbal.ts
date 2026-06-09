import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class TaskClass extends backend {
  queryBuilderForLazyLoad(att) {
    let queryString = "?";

    if (att.searchText) {
      queryString += "&search=" + encodeURIComponent(att.searchText);
    }

    queryString += "&skip=" + att.skip;

    queryString += "&limit=" + att.limit;
    if (att.sort) {
      queryString += "&sort=" + att.sort;
    }
    if (att.sortType) {
      queryString += "&sortType=" + att.sortType;
    }
    return queryString;
  }

  docList(props, query) {
    const str = query ? this.queryBuilder(query) : "";
    if (props.showingFrom === "viewQuote")
      return this.get(`digitalDocument/list/quote/${props.id}${str}`);
    else return this.get(`digitalDocument/list/company/${props.id}${str}`);
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
  ViewDoc(query, id) {
    return this.get(`digitalDocument/view/${id}`);
  }
  editTemplate(query, data) {
    return this.post(`template/${query.slug}/update`, data);
  }
  getTemplateList(query) {
    const str = query ? this.queryBuilderForLazyLoad(query) : "";
    return this.get(`template/${query.slug}/list${str}`);
  }
  savePopulatedPdf(data) {
    return this.post("/digitalDocument/savePdf", data);
  }
  attachedSignedPdf(data) {
    return this.post("/digitalDocument/attachSignedPdf", data);
  }
  getPopulatedPdf(data) {
    return this.post(`/digitalDocument/generatePopulatedPdf`, data);
  }
})();
