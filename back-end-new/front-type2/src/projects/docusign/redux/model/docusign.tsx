import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class userClass extends backend {
  templateList(data, query) {
    let str = '?';
    str += `skip=${query.templateListSkip}`;
    return this.get(`/docusign/${data.slug}/listTemplates${str}`);
  }

  sendEnvelope(payload) {
    return this.post(`/docusign/${payload.slug}/useTemplate`, payload);
  }

  getTemplateRecipients(payload) {
    return this.post(
      `docusign/${payload.slug}/viewTemplateReceipients`,
      payload
    );
  }

  getQuoteEnvelopesHistory(payload) {
    return this.post(`docusign/${payload.slug}/getQuotesEnvelopes`, payload);
  }
  getRecipientOptions(payload) {
    return this.post(`/docusign/admin/dropdown`, payload);
  }
  getAuditData(payload) {
    return this.post("docusign/admin/audit", payload);
  }
})();
