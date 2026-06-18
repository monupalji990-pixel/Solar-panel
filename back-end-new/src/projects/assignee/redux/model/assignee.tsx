import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class AssigneeClass extends backend {

  assigneeListOfCompany(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`company/${query.slug}/assignee_list${str}`);
  }

  assigneeListOfConsumer(query) {
    const str = query ? this.queryBuilder(query) : '';
    return this.get(`consumer/regUser/assignee_list${str}`);
  }

  addAssignee(data, props) {
    if (props.payload.action === 'viewConsumer') return this.post(`consumer/regUser/assignee`, props.payload.data);
    if (props.payload.action === 'viewCompany') return this.post(`company/${data.slug}/assignee`, props.payload.data);
    return true;
  }

  assigneeListAssignee(data) {
    return this.get(`users/${data.slug}/dropdown_list?isActive=1&sort=createdAt&sortType=desc`);
  }

  removeAssignee(query, payload) {
    return this.post(`users/${query.slug}/remove_assignee`, payload);
  }
})();
