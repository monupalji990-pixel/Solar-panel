import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {

    consumerList(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`consumer/regUser/list${str}`);
    }

    consumerCount(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`consumer/regUser/count${str}`);
    }

    addConsumer(i, payload) {
        return this.post(`consumer/regUser/create`, payload);
    }

    editConsumer(i, payload) {
        return this.post(`consumer/regUser/update`, payload);
    }

    viewConsumer(i, payload) {
        return this.get(`consumer/regUser/view/${payload.consumerId}`);
    }

    deleteConsumer(data, payload) {
        return this.post(`consumer/${data.slug}/delete`, { id: payload });
    }

    fetchNotes(query) {
        return this.get(`consumer/regUser/notes/show/${query.currentConsumer._id}`);
    }

    fetchDocument(query) {
        return this.get(`consumer/regUser/documents/${query.currentConsumer._id}`);
    }

    addDocument(query, payload) {
        return this.post(`consumer/regUser/document/add`, payload);
    }

    deleteDocument(data, payload) {
        return this.get(`consumer/${data.slug}/delete_document/${payload.type}/${payload.Consumer}/${payload.did}`);
    }

    fetchMeterReading(query) {
        return this.get(`consumer/regUser/documents/${query.currentConsumer._id}`);
    }

    addMeterReading(query, payload) {
        return this.post(`supplier/regUser/add_reading`, payload);
    }

    addAssignee(i, payload) {
        return this.post(`consumer/regUser/assignee`, payload);
    }

    partnerListConsumer(query) {
        return this.get(`users/${query.slug}/partnerList?sort=createdAt&sortType=desc`);
    }

    addNotes(i, data) {
        return this.post(`consumer/regUser/add_notes`, data);
    }

    sendRequest(data, payload) {
        return this.post(`consumer/regUser/deleteRequest`, payload);
    }

    actionOnSelectData(i, data) {
        if (data.action === 'accept') {
            return this.post(`consumer/admin/deleteMultiConsumer`, { deleteIds: data.selectedData });
        }
        return this.post(`consumer/admin/rejectMultiConsumer`, { deleteIds: data.selectedData });
    }

    cityListForDropdownReq(data, queryData) {
        const str: any = {}
        if (queryData.limit) str.limit = queryData.limit
        if (queryData.searchText) str.city = queryData.searchText
    
        return this.post(`consumer/regUser/citylist`, str);
      }

    consumerTaskNotes(att){
        let queryString = "?";
        queryString += `&skip=${att.skip}`;
        queryString += `&limit=${att.limit}`;
        queryString += `&Consumer=${att.Consumer}`;
        return this.get(`task/regUser/comments` + queryString);
    }
})();
