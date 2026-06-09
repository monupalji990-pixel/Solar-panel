import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {
  userListByAdmin(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`users/${query.slug}/list${str}`);
  }

  userCount(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`users/${query.slug}/count${str}`);
  }

  addNewUser(query, data) {
    return this.post(`users/${query.slug}/add`, data);
  }

  editUser(query, data) {
    return this.post(`users/${query.slug}/edit`, data);
  }

  viewUser(query, data) {
    return this.get(`users/regUser/show/${data.user._id}`);
  }

  roleList() {
    return this.get(`roles/regUser/list`);
  }

  changePassword(i, data) {
    return this.post(`users/admin/updatePassword`, data);
  }

  sendRequest(i, data) {
    return this.post(`users/${i.slug}/deleteRequest`, data);
  }

  actionOnSelectData(i, data) {
    if (data.action === 'accept') {
      return this.post(`users/admin/deleteUsers`, { deleteIds: data.selectedData });
    }
    return this.post(`users/admin/rejectDeleteRequestUsers`, { deleteIds: data.selectedData });
  }

  removeUser(i, data) {
    return this.post(`users/admin/delete_user_and_assignee_other`, data);
  }

  downloadFile(data) {
    return this.postFileDownload(`users/regUser/download_file`, [data]);
  }

  cityListForDropdownReq(data, queryData) {
    const str: any = {}
    if (queryData.limit) str.limit = queryData.limit
    if (queryData.searchText) str.city = queryData.searchText

    return this.post(`consumer/regUser/citylist`, str);
  }

  offlineUserListAPI(att) {

    let queryString = "?";
    queryString += `&skip=${att.skip}`;
    queryString += `&limit=${att.limit}`;

    return this.get(`users/admin/listOffline` + queryString);
  }
})();
