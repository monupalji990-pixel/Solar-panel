import backend from '../../../../sharedUtils/backendLibs/backend';

function queryBuild(query) {
    let queryString = "?";
    queryString += `&skip=${query.skip}`;
    queryString += `&limit=${query.limit}`;
    if (query.search) queryString += `&Search=${query.search}`;
    return queryString;
}

export default new (class CompanyClass extends backend {

    List(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`sendinblue/${query.slug}/listCampaigns${str}`);
    }

    Count(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`company/${query.slug}/count${str}`);
    }

    add(data, payload) {
        return this.post(`sendinblue/${data.slug}/createCampaign`, payload);
    }

    view(data, payload) {
        return this.post(`sendinblue/${data.slug}/viewCampaign`, payload);
    }

    editCompany(data, payload) {
        return this.put(`sendinblue/${data.slug}/updateCampaign`, payload);
    }

    delete(data, payload) {
        return this.post(`sendinblue/${data.slug}/deleteCampaign`, { id: payload });
    }

    sendRequest(data, payload) {
        return this.post(`company/${data.slug}/deleteRequest`, payload);
    }

    sendCampaign(data, payload) {
        return this.post(`sendinblue/${data.slug}/sendCampaign`, payload);
    }

    actionOnSelectData(i, data) {
        if (data.action === 'accept') {
            return this.post(`company/admin/deleteMultiCompany`, { deleteIds: data.selectedData });
        }
        return this.post(`company/admin/rejectMultiCompany`, { deleteIds: data.selectedData });
    }

    templateList(query, slug) {
        const str = query ? queryBuild(query) : '';
        return this.get(`sendinblue/${slug}/listTemplates${str}`);
    }
    
    listcontactsLists(query, slug) {
        const str = query ? queryBuild(query) : '';
        return this.get(`sendinblue/${slug}/listContactlist${str}`);
    }
})();
