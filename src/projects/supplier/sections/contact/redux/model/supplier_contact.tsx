import backend from '../../../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {

  contactListOfSupplier(query) {
    let str = query ? this.queryBuilder(query) : '';
    str += `&supplierId=${(query.supplierId) ? query.supplierId : "0e0f000000f00c0d0000000f"}`
    return this.get(`supplier/${query.slug}/contact_list${str}`);
  }

  viewContact(query, payload) {
    return this.get(`supplier/${query.slug}/contact?supplierId=${query.supplierId}&contactEmail=${payload.contact.Email}`);
  }

  addContact(data, payload) {
    return this.post(`supplier/${data.slug}/contact/add`, payload);
  }

  updateContact(data, payload) {
    return this.post(`supplier/${data.slug}/contact/update`, payload);
  }

  deleteContact(data, payload) {
    return this.post(`supplier/${data.slug}/contact/delete`, payload);
  }
})();
