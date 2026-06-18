import backend from '../../../../sharedUtils/backendLibs/backend';

export default new (class ImportExport extends backend {

  importFile(exportType, type, fileName) {
    if (type === 'company') {
      return this.post(`import/regUser/${exportType}`, { fileName });
    }
    if (!['Funeral', 'Mortgage', 'Energy'].includes(exportType) && type === 'renewal') {
      return this.post(`import/regUser/Renewal`, { fileName, type: exportType });
    }
    return this.post(`import/regUser/Quote`, { fileName, type: exportType });
  }

  importMappingFile(importType, data) {
    if (importType === 'consumer') {
      return this.post(`import/regUser/Consumer`, { Consumers: data });
    }
    if(importType === 'company'){
      return this.post(`/import/regUser/CompanyWithMapping`,data);
    }

    throw new Error('error')
  }

  exportFile(exportType, type) {
    if (type === 'renewal') {
      return this.get(`export/regUser/renewal/${exportType}`);
    }
    return this.get(`export/regUser/${exportType}`);

  }

  downloadLogFile(fileName) {
    return this.get(`import/regUser/download`);
  }
})();
