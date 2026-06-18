import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class userClass extends backend {
  renewalList(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`renewal/${query.slug}/list${str}`);
  }

  renewalCount(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`renewal/regUser/count${str}`);
  }

  viewQuote(data, payload) {
    return this.get(`renewal/${data.slug}/show/${payload.quoteId}`);
  }

  editQuote(data, payload) {
    return this.post(`renewal/${data.slug}/update`, payload);
  }

  deleteRenewal(data, payload) {
    return this.get(`renewal/${data.slug}/delete/${payload}`);
  }

  quoteActions(data, payload, actionType) {
    if (Number(actionType) === 1001 || Number(actionType) === 1012) {
      return this.post(
        `renewal/${data.slug}/provided/${payload.negotiation.RenewalID}`,
        payload
      );
    }
    if (Number(actionType) === 1002) {
      return this.post(`renewal/regUser/action`, payload);
    }

    if (Number(actionType) === 1004) {
      return this.post(`renewal/${data.slug}/invoiceDetail`, payload);
    }
    return 0;
  }

  sendRequest(data, payload) {
    return this.post(`renewal/${data.slug}/deleteRequest`, payload);
  }

  actionOnSelectData(i, data) {
    if (data.action === "accept") {
      return this.post(`renewal/admin/deleteMultiRenewal`, {
        deleteIds: data.selectedData,
      });
    }
    return this.post(`renewal/admin/rejectMultiRenewal`, {
      deleteIds: data.selectedData,
    });
  }

  addNotes(i, data) {
    return this.post(`renewal/regUser/add_notes`, data);
  }

  updateAssignee(data, payload) {
    return this.post(`renewal/${data.slug}/updateAssignee`, payload);
  }

  addQuotePaymentReq(data, payload) {
    return this.post(`renewal/${data.slug}/paymentForDebt`, payload);
  }
  deleteDebtPaymentReq(data, payload) {
    return this.post(`renewal/${data.slug}/deletePayment`, payload);
  }
})();
