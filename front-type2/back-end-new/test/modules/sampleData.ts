module.exports = {
    case1: {
        addSimpleExpsense: {
            configUserLoginCredentials: {
                email: "suresh@1001",
                password: "suresh1212#"
            },
            portalCreation: {
                url: "http://localhost:1000/",
                portalId: 1050
            },
            siteAdminUserCreation: {
                email: "siteadmin",
                password: "suresh1212#",
                portalNumber: 1050,
                role: "5d5141586a9b65536a81c91c"
            },
            loadAmount: {
                receiver: "siteadmin",
                amount: 1000
            },
            transferAmount: {
                sender: "siteadmin",
                receiver: "emp",
                amount: 200,
                comments: "comment"

            },
            deleteSiteAdminExpense: {
                ledgerName: "siteadmin"
            },
            deleteEMPExpense: {
                ledgerName: "emp"
            },
            siteAdminLoginCredentials: {
                email: "siteadmin@1050",
                password: "suresh1212#"
            },
            employeeUserCreation: {
                email: "emp",
                password: "suresh1212#",
                role: "5d5141273a95dfd36a81c91c"
            },
            newCategoryDetails: {
                categoryName: "tea",
                tally_ledger_name: "tea"
            },
            newExpenseByEmployee: {
                sender: "emp",
                expenses: "tea",
                amount: 120.56,
                comments: "sdflkjosadfjlsadjfljsadlfjsadlflsadflsadfjl"
            },
            newExpenseBySiteAdmin: {
                sender: "siteadmin",
                expenses: "tea",
                amount: 120.56,
                comments: "sdflkjosadfjlsadjfljsadlfjsadlflsadflsadfjl"
            },
            newCategoryDetailsConfig: {
                categoryName: "categoryanme",
                tallyLedgerName: "tallyname"
            },
            expenseConfig: {
                sender: "emp",
                expenses: "categoryanme",
                amount: 125,
                comments: "this si scxvl"
            },
            transferAmountConfig: {
                sender: "siteadmin",
                receiver: "emp",
                amount: 200,
                comments: "comment"
            },
            loadAmountConfig: {
                receiver: "siteadmin",
                amount: 1000
            },
            deleteExpenseConfig: {
                ledgerName: "emp"
            }
        }
    }

};
