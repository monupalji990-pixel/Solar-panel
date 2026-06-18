import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {

  supplierList(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`supplier/${query.slug}/list${str}`);
  }

  supplierCount(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`supplier/regUser/count${str}`);
  }

  addSupplier(data, payload) {
    return this.post(`supplier/${data.slug}/create`, payload);
  }

  uploadProfileImage(data) {
    return this.post(`/supplier/admin/uploadLogo`, data);
  }

  removeSupplierLogo(data) {
    return this.post(`/supplier/admin/removeLogo`, data);
  }

  getHeaders(data, payload) {
    return this.postAPI(`admin/getHeaders`, payload);
  }

  generateStandardFlatFile(data, payload){
    return this.postAPI(`admin/generateStandardFlatFile/${payload.value}`, payload.data);
  }

  flatFile(payload){
    return this.getAPI(`file/${payload}`);
  }

  addPrices(data, payload){
    return this.postAPI(`admin/addPrices/${payload.value}`, payload.data);
  }

  removeData(data, payload){
    return this.postAPI(`admin/removeData`, payload);
  }

  deleteSupplier(data, payload) {
    return this.get(`supplier/${data.slug}/delete/${payload}`);
  }

  viewSupplier(data, payload) {
    return this.get(`supplier/${data.slug}/show/${payload.supplier._id}`);
  }

  updateSupplier(data, payload) {
    return this.post(`supplier/${data.slug}/update`, payload);
  }

  addDocument(query, payload) {
    return this.post(`supplier/regUser/add_document`, payload);
  }

  deleteDocument(query, payload) {
    return this.get(`supplier/regUser/delete_document/${payload.type}/${payload.supplier_id}/${payload.did}`);
  }
})();
