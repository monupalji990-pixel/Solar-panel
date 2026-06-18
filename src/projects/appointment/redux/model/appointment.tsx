import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class TaskClass extends backend {

  queryBuilderMatrix(att, payload) {
    let queryString = "?";
    if (att.searchText) {
      queryString += "&search=" + encodeURIComponent(att.searchText);
    }
    queryString += "&skip=" + (att.pageMatrix - 1) * att.limitMatrix;
    queryString += "&limit=" + att.limitMatrix;
    if (att.sort) {
      queryString += "&sort=" + att.sort;
    }
    if (att.sortType) {
      queryString += "&sortType=" + att.sortType;
    }
    if (payload.startTime || payload.weekFirstDay) {
      queryString += "&startTime=" + (payload.weekFirstDay || payload.startTime);
    }
    if (payload.endTime || payload.weekLastDay) {
      queryString += "&endTime=" + (payload.weekLastDay || payload.endTime);
    }
    if (payload.assigneeId) {
      queryString += "&assigneeId=" + payload.assigneeId;
    }
    return queryString;
  }

  appointmentListAPI(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`appoinment/list${str}`);
  }

  userListForAppointmentAPI(data) {
    return this.post(`userList`, data);
  }

  addAppointmentAPI(data) {
    return this.post(`appoinment`, data);
  }

  editAppointmentAPI(payload) {
    return this.put(`appoinment/${payload.id}`, payload);
  }

  deleteAppointmentAPI(payload) {
    return this.del(`appoinment/${payload}`);
  }

  singleAppointmentDetails(data) {
    return this.get(`appoinment/` + data?.id);
  }

  appointmentMatrixList(query, payload) {
    const str = query ? this.queryBuilderMatrix(query, payload) : '';
    return this.get(`appoinment/group-user` + str);
  }
})();
