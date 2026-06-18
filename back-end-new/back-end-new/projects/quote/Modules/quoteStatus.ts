const quoteStatus = {
    newQuote: 1000,
    quoteProvided: 1001,
    quoteAccepted: 1002,
    quoteRejected: 1003,
    quoteInvoiced: 1004,
    revisedQuoteProvided: 1005,
    renewalClose: 1006,
    renewalCloseCreated: 1007,
    quoteExpired: 1008,
    DND: 1009,
    ContractEndDate: 1010,
    PendingSupplierConfirmation: 1011,
    RevisedSupplierRates: 1012,
    InquiryFromWebsite: 1013
};

const RenewalStatus = {
    LivePending: 1000,
    RenewalProvided: 1001,
    RenewalAccepted: 1002,
    RenewalRejected: 1003,
    RenewalInvoiced: 1004,
    RevisedRenewalProvided: 1005,
    RenewalClose: 1006,
    RenewalCloseCreated: 1007,
    RenewalExpired: 1008,
    DND: 1009,
    ContractEndDate: 1010,
    PendingSupplierConfirmation: 1011,
    RevisedSupplierRates: 1012
};

export default {
    quoteStatus,
    RenewalStatus
}