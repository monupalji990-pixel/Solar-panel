import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class TaskClass extends backend {

  companyListForDropdownTemp(data, queryData) {
    let query = 'sort=createdAt&sortType=desc';
    if (queryData && queryData.searchText) query += `&Search=${encodeURIComponent(queryData.searchText)}`
    return this.get(`company/regUser/dropdown_list?${query}`);
  }

  taskList(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`task/${query.slug}/list${str}`);
  }

  taskListData(data) {
    // let str = 'sort=createdAt&sortType=desc';
    // if (data.status) {
    //   str += `&status=${data.status}`
    // }
    // str += `&skip=${(data.page) * data.limit}`;
    // str += `&limit=${data.limit}`;

    let obj: any = {}
    if (data.status) obj.status = [data.status]
    obj.skip = (data.page * data.limit)
    obj.limit = data.limit
    obj.sort = 'createdAt'
    obj.sortType = 'desc'
    if (data.assignee) obj.Assignee = data.assignee
    return this.post(`task/regUser/trello`, obj);
  }

  taskBoardList(payload) {
    return this.post(`task/regUser/trello`, payload);
  }

  taskStats(query) {
    let str = ''
    if (query.assigneeId) str = `?&Assignee=${query.assigneeId}`;
    return this.get(`task/${query.slug}/taskStats${str}`);
  }

  viewBasisTasksAPI(query) {
    let str = ''
    if (query.assigneeTaskId) str = `?&Assignee=${query.assigneeTaskId}`;
    return this.get(`task/${query.slug}/viewBasicTaskDetails${str}`);
  }

  calendarTasksAPI(payload) {
    return this.post(`task/regUser/calTask`, payload);
  }

  taskCount(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`task/regUser/count${str}`);
  }

  deleteRequestCountAPI(query) {
    return this.get(`users/admin/delete-request/count`);
  }

  TodayDueTasks() {
    return this.get(`task/regUser/due_task`);
  }

  addTask(data, payload) {
    return this.post(`task/${data.slug}/create`, payload);
  }

  viewTask(data) {
    return this.get(`task/regUser/show/${data.taskId}`);
  }

  singleCompanyDetail(data) {
    return this.get(`company/regUser/single_show/${data.companyID}`);
  }

  updateTask(data, payload) {
    return this.post(`task/regUser/update`, payload);
  }

  deleteTask(data, payload) {
    return this.post(`task/${data.slug}/deleteTask`, payload);
  }

  addComment(data, payload) {
    return this.post(`task/regUser/comment/add`, payload);
  }

  leadListForDropdownTask(data, queryData) {
    let query = 'sort=createdAt&sortType=desc';
    if (queryData && queryData.companyID) query += `&Company=${queryData.companyID}`
    return this.get(`lead/regUser/dropdown_list?${query}`);
  }

  quoteListForDropdown() {
    return this.get(`quote/regUser/dropdown_list?sort=createdAt&sortType=desc`);
  }

  SaveAttachments(api, data) {
    return this.post(api, data);
  }

  sendRequest(data, payload) {
    return this.post(`task/${data.slug}/delete_request`, payload);
  }

  actionOnSelectData(i, data) {
    if (data.action === 'accept') {
      return this.post(`task/admin/deleteMultiTask`, { deleteIds: data.selectedData });
    }
    return this.post(`task/admin/rejectMultiTask`, { deleteIds: data.selectedData });
  }

  addDocument(payload) {
    return this.post(`task/regUser/documents/add`, payload);
  }

  deleteDocument(payload) {
    return this.post(`task/regUser/documents/remove`, payload);
  }

  uploadImages(data) {
    return this.post(`lead/upload`, data);
  }
})();
