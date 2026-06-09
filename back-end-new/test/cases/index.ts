var commandUtils = require('../commanUtils')
module.exports = async(agent: any, cases: string) => {
    describe('test run as per sample data of case: ' + cases, async() => {
        if (commandUtils.data.sampledata[cases].addSimpleExpsense) {
            await require('./manageuser')(agent, cases)
        }
    })
}