var commanUtils = require('../modules/index')
module.exports = (agent: any) => {
    describe('await test', async () => {
        it('post using await', async () => {
            var request = {
                user: agent,
                value: {
                    loginintial: {}, configAddIntial: {}
                }
            }
            request.value.loginintial = {
                email: "suresh@1001",
                password: "suresh1212#"
            }
            var res = await commanUtils
                .hooks
                .auth
                .login({
                    attName: 'loginintial'
                }, request)
            request.value.configAddIntial = {
                url: "http://localhost:1000/",
                portalId: 1050
            }
            commanUtils
                .hooks
                .portal
                .configAdd({
                    attName: 'configAddIntial'
                }, request)
        })
    })

}