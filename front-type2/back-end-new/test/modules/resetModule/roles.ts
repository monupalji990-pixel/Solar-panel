var data:any = [];
import roleModel from '../../../models/role';
exports.add = async() => {
    for (var i = 0; i < data.length; i++) {
        await roleModel.updateOne({
            roleName: data[i].roleName
        }, data[i], {upsert: true})
    }
}
exports.delete = async() => {
    await roleModel.deleteMany({})
}

data = [
    {
        "_id": "5d5141273a9b65536a81c91c",
        "roleName": "config",
        "authorisedAPIS": [
            "/category/config/list",
            "/category/config/addNew",
            "/category/config/assignUser",
            "/expenses/config/addNew",
            "/expenses/config/list",
            "/expenses/config/updateAmount",
            "/expenses/config/delete/",
            "/transaction/config/loadAmount",
            "/transaction/config/transferAmount",
            "/portal/config/addNew",
            "/portal/config/listAll",
            "/roles/config/add",
            "/roles/config/replace",
            "/roles/config/list",
            "/ledger/config/addnew",
            "/ledger/config/list",
            "/ledger/config/getData/",
            "/ledger/config/update/",
            "ledger/config/assignUser",
            "/users/config/addNew",
            "/users/config/list",
            "/users/config/addNew",
            "/users/config/list",
            "/users/config/addRole",
            "/user/config/changePass",
            "/user/reguser/changePass",
            "/user/reguser/update",
            "/user/config/delete"
        ],
        "authorisedContainers": [
            {
                "name": "Config Manage Role",
                "container": "/role/config/manage",
                "parent": "Role",
                "isSidebar": true,
                "icon": "fa fa-eye"
            }, {
                "name": "Config add",
                "container": "/category/config/addNew",
                "isSidebar": true,
                "parent": "Category",
                "icon": "fa fa-circle-o"
            }, {
                "name": "Config list",
                "container": "/category/config/list",
                "isSidebar": true,
                "parent": "Category",
                "icon": "fa fa-circle-o"
            }, {
                "name": "siteadmin add",
                "container": "/category/siteadmin/addnew",
                "isSidebar": true,
                "parent": "Category",
                "icon": "fa fa-plus-circle"
            }, {
                "name": "siteadmin list",
                "container": "/category/siteadmin/list",
                "isSidebar": true,
                "parent": "Category",
                "icon": "fa fa-eye"
            }, {
                "name": "Config Dashboard",
                "container": "/dashboard/config/view",
                "isSidebar": true,
                "noparent": true,
                "icon": "fa fa-plus-circle"
            }, {
                "name": "SiteAdmin Dashboard",
                "container": "/dashboard/siteadmin/view",
                "isSidebar": true,
                "noparent": true,
                "icon": "fa fa-eye"
            }, {
                "name": "Employee Dashboard",
                "container": "/dashboard/emp/view",
                "isSidebar": true,
                "noparent": true,
                "icon": "fa fa-file"
            }, {
                "name": "config Add",
                "container": "/expense/config/addNew",
                "isSidebar": true,
                "parent": "Expenses",
                "icon": "fa fa-circle-o"
            }, {
                "name": "config List",
                "container": "/expense/config/list",
                "isSidebar": true,
                "parent": "Expenses",
                "icon": "fa fa-circle-o"
            }, {
                "name": "config update",
                "container": "/expense/config/update",
                "isSidebar": true,
                "parent": "Expenses",
                "icon": "fa fa-circle-o"
            }, {
                "name": "siteadmin Add ",
                "container": "/expense/siteadmin/addnew",
                "isSidebar": true,
                "parent": "Expenses",
                "icon": "fa fa-plus-circle"
            }, {
                "name": "siteadmin list ",
                "container": "/expense/siteadmin/list",
                "isSidebar": true,
                "parent": "Expenses",
                "icon": "fa fa-eye"
            }, {
                "name": "config Add Portal",
                "container": "/portal/config/addNew",
                "isSidebar": true,
                "parent": "portal",
                "icon": "fa fa-circle-o"
            }, {
                "name": "config ListPortal",
                "container": "/portal/config/list",
                "isSidebar": true,
                "parent": "portal",
                "icon": "fa fa-circle-o"
            }, {
                "name": "category wise",
                "container": "/report/categoryWise",
                "isSidebar": true,
                "parent": "Reports",
                "icon": "fa fa-file"
            }, {
                "name": "month wise",
                "container": "/report/monthWise",
                "isSidebar": true,
                "parent": "Reports",
                "icon": "fa fa-file"
            }, {
                "name": "tally format",
                "container": "/report/exportToTally",
                "isSidebar": true,
                "parent": "Reports",
                "icon": "fa fa-file"
            }, {
                "name": "config list tickets",
                "container": "/tickets/listTickets",
                "isSidebar": true,
                "parent": "Tickets",
                "icon": "fa fa-circle-o"
            }, {
                "name": "add new tickets",
                "container": "/tickets/addNew",
                "isSidebar": true,
                "parent": "Tickets",
                "icon": "fa fa-plus-circle"
            }, {
                "name": "config Transfer",
                "container": "/tranfer/config/loadAmount",
                "isSidebar": true,
                "parent": "Transfer",
                "icon": "fa fa-circle-o"
            }, {
                "name": "config Load",
                "container": "/tranfer/config/tranfer",
                "isSidebar": true,
                "parent": "Transfer",
                "icon": "fa fa-circle-o"
            }, {
                "name": "SiteAdmin load",
                "container": "/tranfer/SiteAdmin/loadAmount",
                "isSidebar": true,
                "parent": "Transfer",
                "icon": "fa fa-circle-o"
            }, {
                "name": "SiteAdmin Transfer",
                "container": "/tranfer/SiteAdmin/tranfer",
                "isSidebar": true,
                "parent": "Transfer",
                "icon": "fa fa-circle-o"
            }, {
                "name": "Config Manage user",
                "container": "/user/config/manage",
                "isSidebar": true,
                "parent": "User",
                "icon": "fa fa-circle-o"
            }, {
                "name": "reg support",
                "container": "/user/reguser/support",
                "isSidebar": true,
                "parent": "User",
                "icon": "fa fa-circle-o"
            }, {
                "name": "reg edit profile",
                "container": "/user/reguser/editProfile",
                "isSidebar": true,
                "parent": "User",
                "icon": "fa fa-circle-o"
            }, {
                "name": "reguser settings",
                "container": "/user/reguser/settings",
                "isSidebar": true,
                "parent": "User",
                "icon": "fa fa-circle-o"
            }, {
                "name": "SiteAdmin manage",
                "container": "/user/siteadmin/manage",
                "isSidebar": true,
                "parent": "User",
                "icon": "fa fa-circle-o"
            }
        ],
        "configurations": {
            "afterLoginPage": "/role/config/manage"
        }
    }, {
        "_id": "5d5141586a9b65536a81c91c",
        "roleName": "eventSiteAdmin",
        "authorisedAPIS": [
            "/category/SiteAdmin/assignUser",
            "/category/SiteAdmin/list",
            "/category/SiteAdmin/addNew",
            "/users/SiteAdmin/list",
            "/users/SiteAdmin/addnewUser",
            "/users/SiteAdmin/deleteUser",
            "/user/reguser/changePass",
            "/user/reguser/update",
            "/users/SiteAdmin/update",
            "/ledger/SiteAdmin/list",
            "/ledger/SiteAdmin/update",
            "/ledger/SiteAdmin/assignUser",
            "/ledger/SiteAdmin/addnew",
            "/expenses/SiteAdmin/addNew",
            "/expenses/SiteAdmin/list",
            "/transaction/SiteAdmin/loadAmount",
            "/transaction/SiteAdmin/transferAmount",
            "/expenses/SiteAdmin/delete/"
        ],
        "authorisedContainers": [],
        "configurations": {
            "afterLoginPage": ""
        }
    }, {
        "_id": "5d5141273a9b65536a814515",
        "roleName": "eventCashier",
        "authorisedAPIS": [],
        "authorisedContainers": [],
        "configurations": {
            "afterLoginPage": ""
        }
    }, {
        "_id": "5d5141273a95dfd36a81c91c",
        "roleName": "eventemp",
        "authorisedAPIS": [
            "/category/reguser/list",
            "/user/reguser/changePass",
            "/user/reguser/update",
            "/ledger/regUser/list",
            "/expenses/reguser/addNew",
            "/expenses/reguser/list"
        ],
        "authorisedContainers": [],
        "configurations": {
            "afterLoginPage": ""
        }
    }
]