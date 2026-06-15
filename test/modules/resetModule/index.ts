exports.deleteDatabase = async() => {
    await require('./roles').delete()
    await require('./user').delete()
}
exports.addDatabase = async() => {
    await require('./roles').add()
    await require('./user').add()

}