import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {
  itemListApi(query) {    
    try {
      const str = query ? this.queryBuilder(query) : '';
      return this.get(`invoice/item${str}`);
    } catch (error) {
      console.log("error in invoice item list", error);
    }
  }

  addItemApi(data) {
    return this.post(`invoice/item`, data);
  }

  editItemApi(data) {
    return this.put(`invoice/item/${data._id}`, data);
  }

  deleteItemApi(data) {
    return this.del(`invoice/item/${data}`);
  }
})();
