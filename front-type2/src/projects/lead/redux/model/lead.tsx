import backend from "../../../../sharedUtils/backendLibs/backend";

export default new (class LeadClass extends backend {
  constructor() {
    super();
  }

  queryBuilder(att) {
    let queryString = "?";
    if (att.slug) queryString += `${att.slug}`;

    if (att.consumerID || att.showingFrom == "viewConsumer") {
      queryString += "&Consumer=" + att.consumerID;
      queryString += `&isFromCompanyOrConsumerDrawer=true`;
    } else {
      queryString += "&Company=" + att.companyId;
      queryString += `&isFromCompanyOrConsumerDrawer=true`;
    }
    if (att.searchText) queryString += "&Search=" + encodeURIComponent(att.searchText);
    queryString += "&skip=" + (att.page - 1) * att.limit;
    queryString += "&limit=" + att.limit;
    if (att.sort) queryString += "&sort=" + att.sort;
    if (att.sortType) queryString += "&sortType=" + att.sortType;
    if (att.OnlyDeleteData) queryString += "&isDelete=" + true;

    if (att.filterData) {
      if (att.filterData.isPaid === true || att.filterData.isPaid === false) {
        queryString += "&isPaid=" + (att.filterData.isPaid)
      }
      if (att.filterData.DataOfArray) {
        att.filterData.DataOfArray.map((item) => {
          queryString = `${queryString}&DataOf=${item}`;
        });
      }
      if (att.filterData.PartnerArray) {
        att.filterData.PartnerArray.map((item) => {
          queryString = `${queryString}&Partner=${item}`;
        });
      }
      if (att.filterData.isImported) queryString += "&isImported=true";
      if (att.filterData.StatusArray) {
        att.filterData.StatusArray.map((item) => {
          queryString = `${queryString}&status=${item}`;
        });
      }
      if (att.filterData.serviceData) {
        att.filterData.serviceData.map((item) => {
          queryString = `${queryString}&serviceData=${item.value}`;
        })
      }

      if (att.filterData.subservice) {
        att.filterData.subservice.map((item) => {
          queryString = `${queryString}&subservice=${item.value}`;
        })
      }
      if (att.filterData.installerType) {
        att.filterData.installerType.map((item) => {
          queryString = `${queryString}&installerType=${item}`;
        });
      }

      if (att.filterData?.source) {
        queryString = `${queryString}&source=${att.filterData?.source?.value}`;
      }
      if (att.filterData.Assignee) {
        queryString = `${queryString}&Assignee=${att.filterData.Assignee.value}`;
      }
      if (att.filterData.appoinmentBooker) {
        queryString = `${queryString}&appoinmentBooker=${att.filterData.appoinmentBooker.value}`;
      }
      if (att.filterData.LeadGenerator) {
        queryString = `${queryString}&LeadGenerator=${att.filterData.LeadGenerator.value}`;
      }
      if (att.filterData.leadAdministrator) {
        queryString = `${queryString}&leadAdministrator=${att.filterData.leadAdministrator.value}`;
      }
      if (att.filterData.Installer) {
        queryString = `${queryString}&Installer=${att.filterData.Installer.value}`;
      }
      if (att.filterData.Surveyor) {
        queryString = `${queryString}&Surveyor=${att.filterData.Surveyor.value}`;
      }
      if (att.filterData.SystemDesigner) {
        queryString = `${queryString}&SystemDesigner=${att.filterData.SystemDesigner.value}`;
      }
      if (att.filterData.leadType) {
        queryString = `${queryString}&leadType=${att.filterData.leadType}`
      }
      if (att.filterData.jobType) {
        queryString = `${queryString}&jobType=${att.filterData.jobType}`
      }
      if (att.filterData.dateTo) {
        queryString = `${queryString}&dateTo=${att.filterData.dateTo}`;
      }
      if (att.filterData.dateFrom) {
        queryString = `${queryString}&dateFrom=${att.filterData.dateFrom}`;
      }
      if (att.filterData.InstallationCompleteStartDate) {
        queryString = `${queryString}&InstallationCompleteStartDate=${att.filterData.InstallationCompleteStartDate}`;
      }
      if (att.filterData.InstallationCompleteEndDate) {
        queryString = `${queryString}&InstallationCompleteEndDate=${att.filterData.InstallationCompleteEndDate}`;
      }
      if (att.filterData.SubmissionCompletedStartDate) {
        queryString = `${queryString}&SubmissionCompletedStartDate=${att.filterData.SubmissionCompletedStartDate}`;
      }
      if (att.filterData.SubmissionCompletedEndDate) {
        queryString = `${queryString}&SubmissionCompletedEndDate=${att.filterData.SubmissionCompletedEndDate}`;
      }
      if (att.filterData.dialer) {
        queryString = `${queryString}&dialer=${att.filterData.dialer.value}`;
      }
    }
    return queryString;
  }

  leadList(data) {
    const str = data ? this.queryBuilder(data) : "";
    return this.get(`lead/${data.slug}/list${str}`);
  }

  leadCount(query) {
    const str = query ? this.queryBuilder(query) : "";
    return this.get(`lead/${query.slug}/count${str}`);
  }

  addLead(data, lead) {
    return this.post(`lead/${data.slug}/add`, lead);
  }

  deleteLead(data, payload) {
    return this.post(`lead/${data.slug}/delete`, { deleteIds: payload });
  }

  viewLead(data, payload) {
    return this.get(`lead/regUser/show/${payload.leadId}`);
  }

  updateLead(data, payload) {
    return this.post(`lead/${data.slug}/update`, payload);
  }

  salesRepList() {
    return this.get(`users/regUser/salesRepList?sort=createdAt&sortType=desc`);
  }

  sendRequest(data, payload) {
    return this.post(`lead/${data.slug}/deleteRequest`, payload);
  }

  actionOnSelectData(i, data) {
    if (data.action === "accept") {
      return this.post(`lead/admin/deleteMultiLead`, {
        deleteIds: data.selectedData,
      });
    }
    return this.post(`lead/admin/rejectMultiLead`, {
      deleteIds: data.selectedData,
    });
  }

  addSalesRepAssignee(i, data) {
    return this.post(`lead/regUser/assignee_sales_rep`, data.payload);
  }

  addNotes(i, data) {
    return this.post(`lead/regUser/add_notes`, data);
  }

  soldService(i, data) {
    return this.post(`lead/regUser/sold_service`, data);
  }
  saveServiceData(i, data) {
    return this.post(`lead/regUser/save_service`, data);
  }

  getLeadSourceCountAPI(i, data) {
    return this.get(`lead/regUser/source_stats`);
  }

  getPdfReqAPI(data) {
    return this.postPdf(`lead/admin/getPdf`, data);
  }
})();
