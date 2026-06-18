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
    if (att.type) {
      queryString += "&type=" + att.type;
    }
    return queryString;
  }
  docList(props, query) {
    const str = query ? this.queryBuilder(query) : "";
    if (props.showingFrom === "viewQuote")
      return this.get(`digitalDocument/${query.slug}/list/quote/${props.id}${str}&type=quote`);
    else if (props.showingFrom === "viewCompany")
      return this.get(`digitalDocument/${query.slug}/list/company/${props.id}${str}&type=company`);
    else if (props.showingFrom === "viewConsumer")
      return this.get(`digitalDocument/${query.slug}/list/company/${props.id}${str}&type=consumer`);
    else if (props.showingFrom === "viewRenewal")
      return this.get(`digitalDocument/${query.slug}/list/renewal/${props.id}${str}&type=renewal`);
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
    return this.get(`digitalDocument/${query.slug}/view/${id}`);
  }
  editTemplate(query, data) {
    return this.post(`template/${query.slug}/update`, data);
  }
  getTemplateList(query) {
    const str = query ? this.queryBuilderForLazyLoad(query) : "";
    return this.get(`template/${query.slug}/list${str}`);
  }
  savePopulatedPdf(query, data) {
    return this.post(`/digitalDocument/${query.slug}/savePdf`, data);
  }
  attachedSignedPdf(query, data) {
    return this.post(`/digitalDocument/${query.slug}/attachSignedPdf`, data);
  }
  attachedForVerbal(query, data) {
    return this.post(`/digitalDocument/${query.slug}/attachReadOnly`, data);
  }
  getPopulatedPdf(query, data) {
    return this.post(`/digitalDocument/${query.slug}/generatePopulatedPdf`, data);
  }
})();
