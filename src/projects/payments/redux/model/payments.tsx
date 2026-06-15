import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class HistoryClass extends backend {

    listPaymentHistory(query) {
        let search = {}
        if (query.search) search['search'] = query.search;
        const str = query ? this.queryBuilder(query) : '';
        return this.post(`payment/regUser/listPaymentHistory${str}&sortType=desc&sort=createdAt`, search);
    }

    getPaymentHistory(data) {
        return this.post(`payment/regUser/getPaymentHistory`, data);
    }

    editPaymentHistoryAPI(data) {
        return this.post(`payment/regUser/edit-payment`, data);
    }

    editPayment(data) {
        return this.post(`payment/regUser/updatePaymentHistory`, data);
    }

    addPaymentHistory(data) {
        return this.post(`payment/regUser/addPaymentHistory`, data);
    }

    splitCommission(data) {
        return this.post(`payment/regUser/splitCommission`, data);
    }

    loadSupplierPayment(data) {
        return this.post(`payment/regUser/loadSupplierPayment`, data);
    }

    salesRepPaymentAPI(query) {
        let str: any = {};
        if (query.comissPage && query.comissLimit) str.skip = (query.comissPage - 1) * query.comissLimit;
        if (query.comissLimit) str.limit = query.comissLimit
        if (query.salesRepUserId?.user) str.user = query.salesRepUserId?.user
        if (query.salesRepUserId.search) str.search = query.salesRepUserId?.search

        return this.post(`payment/regUser/user/commission`, str);
    }

    quoteDropdownList(data) {
        return this.post(`payment/regUser/user/quotes`, data);
    }

    splitCommissionReqAPI(query) {
        let str: any = {};
        if (query.splitPage && query.splitLimit) str.skip = (query.splitPage - 1) * query.splitLimit;
        if (query.splitLimit) str.limit = query.splitLimit
        if (query.splitId?.paymentHistoryId) str.paymentHistoryId = query.splitId?.paymentHistoryId
        if (query.splitId?.user) str.user = query.splitId?.user
        if (query.splitId?.search) str.search = query.splitId?.search

        return this.post(`payment/regUser/split-commission-records`, str);
    }

    editBulkAction(data) {
        return this.post(`payment/regUser/edit-bulk-payment`, data);
    }

    editMonthlyPayoutAPI(data) {
        return this.post(`payment/regUser/edit-monthly-payment`, data);
    }

})();
