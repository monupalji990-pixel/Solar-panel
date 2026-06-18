import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class CompanyClass extends backend {

    companyList(query) {        
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`company/${query.slug}/list${str}`);
    }

    companyCount(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`company/${query.slug}/count${str}`);
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

    contactListOfCompany(query, payload) {
        return this.get(`company/regUser/contact_list?companyId=${payload.companyId}`);
    }

    siteListOfCompany(query, payload) {
        return this.get(`company/regUser/site_list?companyId=${payload.companyId}`);
    }

    editCompany(query, payload) {
        return this.post(`company/${query.slug}/edit`, payload);
    }

    fetchNotes(query) {
        return this.get(`company/regUser/notes/show/${query.currentCompany._id}`);
    }

    addNotes(query, payload) {
        return this.post(`company/regUser/add_notes`, payload);
    }

    fetchDocument(query) {
        return this.get(`company/regUser/documents/${query.currentCompany._id}`);
    }

    addDocument(query, payload) {
        return this.post(`company/regUser/document/add`, payload);
    }

    fetchMeterReading(query) {
        return this.get(`company/regUser/documents/${query.currentCompany._id}`);
    }

    addMeterReading(query, payload) {
        return this.post(`supplier/regUser/add_reading`, payload);
    }

    deleteDocument(query, payload) {
        return this.get(`company/regUser/delete_document/${payload.type}/${payload.companyId}/${payload.did}`);
    }

    addAssignee(data, payload) {
        return this.post(`company/${data.slug}/assignee`, payload);
    }

    deleteCompany(data, payload) {
        return this.post(`company/${data.slug}/deleteCompany`, { id: payload });
    }

    sendRequest(data, payload) {
        return this.post(`company/${data.slug}/deleteRequest`, payload);
    }

    actionOnSelectData(i, data) {
        if (data.action === 'accept') {
            return this.post(`company/admin/deleteMultiCompany`, { deleteIds: data.selectedData });
        }
        return this.post(`company/admin/rejectMultiCompany`, { deleteIds: data.selectedData });
    }

    dropdownCompanyForLead(query) {
        const skip = (query.page - 1) * query.limit;
        const obj = { search: query.searchText, skip, limit: query.limit }
        return this.post(`company/${query.slug}/dropdownCompanyForLead`, obj);
    }

    companyTaskNotes(att){
        let queryString = "?";
        queryString += `&skip=${att.skip}`;
        queryString += `&limit=${att.limit}`;
        queryString += `&Company=${att.Company}`;
        return this.get(`task/regUser/comments` + queryString);
    }

})();
