import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class HistoryClass extends backend {

    historyList(query) {
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`users/regUser/history_list${str}&sortType=desc&sort=createdAt`);
    }

    historyCount(query){
        const str = query ? this.queryBuilder(query) : '';
        return this.get(`users/regUser/count${str}&sortType=desc&sort=createdAt`);
    }
})();
