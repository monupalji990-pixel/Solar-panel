import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class userClass extends backend {
  constructor() {
    super();
  }

  queryBuilder(att) {
    let queryString = "?";
    if (att.companyId) {
      queryString += "&companyId=" + att.companyId;
    } else {
      queryString += "&companyId=0e0f000000f00c0d0000000f";
    }
    if (att.searchText) {
      queryString += "&search=" + encodeURIComponent(att.searchText);
    }
    queryString += "&skip=" + (att.page - 1) * att.limit;
    queryString += "&limit=" + att.limit;
    if (att.sort) {
      queryString += "&sort=" + att.sort;
    }
    if (att.sortType) {
      queryString += "&sortType=" + att.sortType;
    }
    return queryString;
  }

  companyList(query) {
    let str = query ? this.queryBuilder(query) : "";
    return this.get(`company/${query.slug}/list${str}`);
  }

  addCompany(data, payload) {
    return this.post(`company/${data.slug}/add`, payload);
  }

  addContact(data, payload) {
    return this.post(`users/${data.slug}/addContact`, payload);
  }

  editContact(data, payload) {
    return this.post(`users/${data.slug}/editContact`, payload);
  }

  addSite(data, payload) {
    return this.post(`site/${data.slug}/add`, payload);
  }

  deleteContact(data, payload) {
    return this.post(`users/${data.slug}/deleteContact`, payload);
  }

  viewCompany(data, payload) {
    return this.get(`company/${data.slug}/show/${payload.companyId}`);
  }

  contactListOfCompany(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`company/regUser/contact_list${str}`);
  }

  viewContact(data) {
    return this.get(`users/regUser/show/${data.contactId}`);
  }
})();
