module.exports = (database: { deleteDatabase: () => any; addDatabase: () => any }) => {
    it('reset data', async() => {
        await database.deleteDatabase()
        await database.addDatabase()
    })
}