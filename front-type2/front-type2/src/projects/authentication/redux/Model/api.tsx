import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class authAPI extends backend {
  constructor() {
    super();
  }
  checkReset(d) {
    return this.get('checkResetToken?token=' + d);
  }
  resetPass(d, data) {
    return this.post('resetPassword?token=' + d, data);
  }
  forgotPass(data) {
    return this.post('forgotPass', data);
  }
  login(value) {
    return this.post('login', value);
  }
  isLoggedIn() {
    return this.get('isLoggedIn');
  }
  Logout() {
    return this.get('logout');
  }
  regUserChangePass(obj) {
    return this.post('users/reguser/changePassword', obj);
  }
  addNewSEmail(obj) {
    return this.post('/user/reguser/add/secondaryEmail', obj);
  }
  removeSEmail(index) {
    return this.get('user/reguser/remove/secondaryEmail/' + index);
  }
  updateRegUser(payload) {
    return this.post(`users/admin/editProfile`, payload);
  }
  swapWithPrimaryEmail(index) {
    return this.get('user/reguser/swapWithPrimaryEmail/' + index);
  }
  uploadProfileImage(data) {
    return this.post('/users/regUser/avatar', data);
  }
  updateRegUserColumn(obj) {
    return this.post('user/reguser/updateColumn', obj);
  }
  newUpdate() {
    return this.get('new-update');
  }
})();
