var commanUtils = require('../commanUtils')
var BASEURL = "/api/users/"
exports.adminAdd = async(user: any, value: any) => {
    return commanUtils
        .general
        .postAPI(user, BASEURL + 'admin/addnewUser', value)
}
exports.adminList = async(user: any, value: any) => {
    return commanUtils
        .general
        .getAPI(user, BASEURL + 'admin/list')
}
exports.adminUpdate = (user: { post: (arg0: string) => { (): any; new(): any; send: { (arg0: any): { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any } }; new(): any } }; new(): any } } }, value: any) => {
    return new Promise((resolve, reject) => {
        user
            .post('/api/users/admin/update')
            .send(value)
            .expect(200)
            .end((err: any, resp: any) => {
                if (err) {
                    return reject(err)
                }
                if (resp.body.err) {
                    return reject(resp.body.err)
                }
                if (!resp.body.success) {
                    return reject(resp.body)
                }
                return resolve(resp)
            })
    })
}
exports.adminDelete = (user: { get: (arg0: string) => { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any } }; new(): any } } }, value: any) => {
    return new Promise((resolve, reject) => {
        user
            .get('/api/users/admin/deleteUser/5d5fba891c9d440001f15007')
            .expect(200)
            .end((err: any, resp: any) => {
                if (err) {
                    return reject(err)
                }
                if (resp.body.err) {
                    return reject(resp.body.err)
                }
                if (!resp.body.success) {
                    return reject(resp.body)
                }
                return resolve(resp)
            })
    })
}
exports.regUserChangePass = (user: { post: (arg0: string) => { (): any; new(): any; send: { (arg0: any): { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any } }; new(): any } }; new(): any } } }, value: { body: any }) => {
    return new Promise((resolve, reject) => {
        user
            .post('/api/user/reguser/changePass')
            .send(value.body)
            .expect(200)
            .end((err: any, resp: any) => {
                if (err) {
                    return reject(err)
                }
                if (resp.body.err) {
                    return reject(resp.body.err)
                }
                if (!resp.body.success) {
                    return reject(resp.body)
                }
                return resolve(resp)
            })
    })
}
exports.regUserUpdate = (user: { post: (arg0: string) => { (): any; new(): any; send: { (arg0: any): { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any } }; new(): any } }; new(): any } } }, value: any) => {
    return new Promise((resolve, reject) => {
        user
            .post('/api/user/reguser/update')
            .send(value)
            .expect(200)
            .end((err: any, resp: any) => {
                if (err) {
                    return reject(err)
                }
                if (resp.body.err) {
                    return reject(resp.body.err)
                }
                if (!resp.body.success) {
                    return reject(resp.body)
                }
                return resolve(resp)
            })
    })
}