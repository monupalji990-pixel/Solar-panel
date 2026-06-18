const request = require('supertest');

exports.configAdd = (user: { post: (arg0: string) => { (): any; new(): any; send: { (arg0: any): { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; }, value: { body: any; }) => {
    return new Promise((resolve, reject) => {
        user
            .post('/api/roles/config/add')
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
exports.configReplace = (user: { post: (arg0: string) => { (): any; new(): any; send: { (arg0: any): { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, resp: any) => void): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; }, value: { body: any; }) => {
    return new Promise((resolve, reject) => {
        user
            .post('/api/roles/config/replace')
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
exports.configlist = (user: { get: (arg0: string) => { (): any; new(): any; expect: { (arg0: number): { (): any; new(): any; end: { (arg0: (err: any, res: any) => void): void; new(): any; }; }; new(): any; }; }; }, value: { response: { shouldId: any; }; }) => {
    return new Promise((resolve, reject) => {
        user
            .get('/api/roles/config/list')
            .expect(200)
            .end((err: any, res: { body: { err: any; success: any; count: any; data: any[]; }; }) => {
                if (err) 
                    return reject(err);
                if (res.body.err) 
                    return reject(res.body.err)
                if (!res.body.success) 
                    return reject(res.body)
                if (!res.body.count || !res.body.data) {
                    return reject(res.body)
                }
                if (!res.body.data.filter((v: { _id: any; }) => v._id == value.response.shouldId)[0]) {
                    return reject({err: "list data not coming properly"})
                }
                resolve()
            });
    })
}
