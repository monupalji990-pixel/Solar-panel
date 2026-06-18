import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class userClass extends backend {
  queryBuilder(att) {
    let queryString = "?";
    if (att.companyId) {
      queryString += "&companyId=" + att.companyId;
    } else {
      queryString += "&companyId=0e0f000000f00c0d0000000f";
    }
    if (att.searchText) {
      queryString += "search=" + att.searchText;
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
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`company/${query.slug}/list${str}`);
  }

  addCompany(data, payload) {
    return this.post(`company/${data.slug}/add`, payload);
  }

  addContact(data, payload) {
    return this.post(`users/${data.slug}/addContact`, payload);
  }

  addSite(data, payload) {
    return this.post(`site/${data.slug}/add`, payload);
  }

  viewCompany(data, payload) {
    return this.get(`company/${data.slug}/show/${payload.companyId}`);
  }

  siteListOfCompany(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`company/regUser/site_list${str}`);
  }

  siteListForLeadDropDown(query) {
    return this.post(`company/admin/dropdownSiteForLead`, query);
  }

  viewSite(data, payload) {
    return this.get(`site/regUser/show/${payload.site._id}`);
  }

  editSite(data, payload) {
    return this.post(`site/${data.slug}/edit`, payload);
  }

  deleteSite(data, payload) {
    return this.post(`site/${data.slug}/deleteSite`, payload);
  }
})();
