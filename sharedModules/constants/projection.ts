export default {
    user: {
        config: {
            list: {
                email: 1,
                password: 1
            }
        },
        admin: {
            list: {
                email: 1,
                password: 1
            },
            populate: {
                email: 1
            }
        }
    },
    ledger: {
        regUser: {
            list: {
                ledgerName: 1,
                ledgerType: 1,
                tallyLedgerName: 1
            }
        }
    },
    transaction: {
        reguser: {
            getData: {
                ledgerName: 1,
                dabit: 1,
                credit: 1,
                balance: 1,
                image: 1,
                transactionTimestamps: 1,
                comments: 1,
                owner: 1
            }
        },
        siteAdmin: {
            listByLedger: {

            }
        }
    },
    category: {
        sitadmin: {
            list: {
                ledgerName: 1,
                ledgerType: 1,
                tallyLedgerName: 1
            }
        }
    },
    expenses: {
        siteAdmin: {
            list: {}
        }
    }
};
