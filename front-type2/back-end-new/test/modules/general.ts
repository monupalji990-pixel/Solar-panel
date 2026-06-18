var {expect} = require('chai');
var _ = require('lodash')
exports.postAPI = async(user: { post: (arg0: any) => { (): any; new(): any; send: { (arg0: any): any; new(): any; }; }; }, api: string, data: any) => {
    var res = await user
        .post(api)
        .send(data)
    expect(res.status, "error on " + api + res.error.text)
        .to
        .equal(200)
    expect(res.body.err, "error on " + api + JSON.stringify(res.body.err)).to.be.undefined
    expect(res.body, "error on " + api + JSON.stringify(res.body))
        .to
        .have
        .property('success')
    return res.body;
}
exports.getAPI = async(user: { get: (arg0: any) => any; }, api: string) => {
    var res = await user.get(api)
    expect(res.status, "error on " + api + res.error.text)
        .to
        .equal(200)
    expect(res.body.err, "error on " + api + JSON.stringify(res.body.err)).to.be.undefined
    expect(res.body, "error on " + api + JSON.stringify(res.body))
        .to
        .have
        .property('success')
    return res.body;
}
exports.isFunction = (functionToCheck: any) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
exports.matchWholeObject = (setA: any[], setB: any) => {
    return setA.filter((v: any) => {
        return _.isMatch(v, setB);
    })
}