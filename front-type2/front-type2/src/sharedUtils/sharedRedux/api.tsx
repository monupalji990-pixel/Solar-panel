import backend from "../backendLibs/backend";

export default new (class userClass extends backend {
  getOptions() {
    this.baseURL = "https://jsonplaceholder.typicode.com/todos/";
    return this.get("");
  }

  queryBuilder(att) {
    let queryString = "";
    if (att.query.search)
      queryString +=
        (queryString ? "&" : "?") +
        "search=" +
        encodeURIComponent(att.query.search);
    if (att.query.Company)
      queryString +=
        (queryString ? "&" : "?") +
        "Company=" +
        encodeURIComponent(att.query.Company);
    if (att.query.Consumer)
      queryString +=
        (queryString ? "&" : "?") +
        "Consumer=" +
        encodeURIComponent(att.query.Consumer);
    return queryString;
  }
  // Drive APIs (Folder or Files CRUD APIs)

  driveListAPI(data) {
    return this.post(`drive/list`, data);
  }

  driveAddFileAPI(data) {
    return this.post(`drive/file`, data);
  }

  driveAddFolderAPI(data) {
    return this.post(`drive/folder`, data);
  }

  driveRenameFolderAPI(id, data) {
    return this.put(`drive/folder/${id}`, data);
  }

  deleteDriveFileAPI(id) {
    return this.del(`drive/${id}`);
  }

  deleteDriveFolderAPI(id) {
    return this.del(`drive/folder/${id}`);
  }

  driveAllFolder(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`drive-new/list-all${str}`);
  }

  driveAllFolderPostAPI(data) {
    return this.post(`drive/list-all`, data);
  }

  driveMoveFolder(data) {
    return this.post(`drive-new/move-folder`, data);
  }

  driveMoveFolderPostAPI(data) {
    return this.post(`drive/move-folder`, data);
  }
})();
