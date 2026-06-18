import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class TaskClass extends backend {
  queryBuilder(att) {
    let queryString = "?";
    if (att.query) queryString += "&search=" + encodeURIComponent(att.query);
    return queryString;
  }

  driveListAPI(data) {
    return this.post(`drive-new/list`, data);
  }

  driveAddFileAPI(data) {
    return this.post(`drive-new/file`, data);
  }

  driveAddFolderAPI(data) {
    return this.post(`drive-new/folder`, data);
  }

  driveRenameFolderAPI(id, data) {
    return this.put(`drive-new/folder/${id}`, data);
  }

  deleteDriveFileAPI(id) {
    return this.del(`drive-new/${id}`);
  }

  deleteDriveFolderAPI(id) {
    return this.del(`drive-new/folder/${id}`);
  }

  driveAllFolder(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`drive-new/list-all${str}`);
  }

  driveMoveFolder(data) {
    return this.post(`drive-new/move-folder`, data);
  }
})();
