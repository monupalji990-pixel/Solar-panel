var commanUtils = require('../commanUtils')

var BASEURL = "/api/"
exports.login = async(user: any, value: any) => {
    return commanUtils
        .general
        .postAPI(user, BASEURL + 'login', value)
}
exports.logout = async(user: any, value: any) => {
    return commanUtils
        .general
        .getAPI(user, BASEURL + 'logout', value)
}
exports.isLoggedIn = async(user: any, value: any) => {
    return commanUtils
        .general
        .getAPI(user, BASEURL + 'isloggedin', value)
}