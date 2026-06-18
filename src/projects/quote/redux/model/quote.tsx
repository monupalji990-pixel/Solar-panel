import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class userClass extends backend {
    quoteList(query) {
        const str: any = query ? this.queryBuilder(query) : '';
        return this.get(`quote/${query.slug}/list${str}`);
    }

    quoteCount(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`quote/regUser/count${str}`);
    }

    addQuote(data, payload) {
        return this.post(`quote/${data.slug}/create`, payload);
    }

    addQuotePaymentReq(data, payload) {
        return this.post(`quote/${data.slug}/paymentForDebt`, payload);
    }

    deleteDebtPaymentReq(data, payload) {
        return this.post(`quote/${data.slug}/deletePayment`, payload);
    }

    addRenewalFromQuote(data, payload) {
        return this.post(`quote/${data.slug}/createRenewalFromQuote`, payload)
    }

    createDuplicateQuote(data, payload) {
        return this.post(`quote/${data.slug}/createDuplicateQuote`, payload);
    }

    viewQuote(data, payload) {
        return this.get(`quote/${data.slug}/show/${payload.quoteId}`);
    }

    editQuote(data, payload) {
        return this.post(`quote/${data.slug}/update`, payload);
    }

    restartQuote(data, payload) {
        return this.get(`quote/${data.slug}/restart/${payload}`);
    }

    leadListForDropdown() {
        return this.get(`lead/regUser/dropdown_list?sort=createdAt&sortType=desc`);
    }

    supplierListForDropdown(data) {
        return this.get(`supplier/${data.slug}/list?isActive=1&sort=createdAt&sortType=desc`);
    }

    assigneeListquote(data) {
        return this.get(`users/${data.slug}/dropdown_list?isActive=1&sort=createdAt&sortType=desc`);
    }

    updateAssignee(data, payload) {
        return this.post(`quote/${data.slug}/updateAssignee`, payload);
    }

    deleteQuote(data, payload) {
        return this.get(`quote/${data.slug}/deleteQuote/${payload}`);
    }

    quoteActions(data, payload, actionType) {
        if (actionType == 'solar' || actionType == 'paidsolar') {
            return this.post(`quote/regUser/quoteAction`, payload);
        }
        else {
            if (Number(actionType) === 1001 || Number(actionType) === 1012) {
                return this.post(`quote/${data.slug}/provided/${payload.negotiation.QuoteID}`, payload);
            } else if (Number(actionType) === 1002) {
                return this.post(`quote/regUser/quoteAction`, payload);
            } else if (Number(actionType) === 1004) {
                return this.post(`quote/${data.slug}/invoiceDetail`, payload);
            } else {
                return 0;
            }
        }
    }

    sendRequest(data, payload) {
        return this.post(`quote/${data.slug}/quoteDeleteRequest`, payload);
    }

    actionOnSelectData(i, data) {
        if (data.action === 'accept') {
            return this.post(`quote/admin/deleteMultiQuote`, { deleteIds: data.selectedData });
        }
        return this.post(`quote/admin/rejectMultiQuote`, { deleteIds: data.selectedData });
    }

    addNotes(i, data) {
        return this.post(`quote/regUser/add_notes`, data);
    }

    getPdfReqAPI(data) {
        return this.postPdf(`quote/admin/getPdf`, data);
    }

    uploadImages(data) {
        return this.post(`lead/upload`, data);
    }
})();
