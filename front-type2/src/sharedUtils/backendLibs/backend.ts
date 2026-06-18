import axios from "axios";

// Add axios logging to help debug backend requests/responses.
// Runs once when the module is imported and captures all axios calls.
// Enabled for production too (needed for Render troubleshooting).
{
  axios.interceptors.request.use(
    (req) => {
      try {
        // eslint-disable-next-line no-console
        console.groupCollapsed("API Request: ", req.method?.toUpperCase(), req.url);
        // eslint-disable-next-line no-console
        console.log("Request headers:", req.headers);
        // eslint-disable-next-line no-console
        console.log("Request data:", req.data);
        // eslint-disable-next-line no-console
        console.groupEnd();
      } catch (e) {}
      return req;
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error("API Request Error:", err);
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      try {
        // eslint-disable-next-line no-console
        console.groupCollapsed("API Response: ", res.config?.method?.toUpperCase(), res.config?.url, "->", res.status);
        // eslint-disable-next-line no-console
        console.log("Response data:", res.data);
        // eslint-disable-next-line no-console
        console.groupEnd();
      } catch (e) {}
      return res;
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error("API Response Error:", err);
      return Promise.reject(err);
    }
  );
}

export default class backend {
  constructor() {
// Force Render backend in all environments
    this.baseURL = "http://localhost:8087/api/";
    this.token = localStorage.getItem("token");
    
    
  }
  baseURL: any;
  token: any;
  startLoader() {}
  endLoader() {}
  get(url, data?: any) {
    const that = this;
    return new Promise((resolve, reject) => {
      this.startLoader();
      axios({
        method: "get",
        url:
          that.baseURL +
          url +
          ((url.includes("company/") || url.includes("consumer/"))
            ? (url.includes("?") ? "&" : "?") + `_bb=${Date.now()}`
            : ""),
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + this.token,

        },
      })
        .then((response) => {
          this.endLoader();
          if (response.data.status == 1001) {
            // history.push('/auth/login');
            reject(new Error(response.data));
          } else if (response.data.status == 1004) {
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((response) => {
          this.endLoader();
          reject(response);
        });
    });
  }
  post(url, data?: any) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: that.baseURL + url,
        withCredentials: true,
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          console.log("Response from POST", response.data);
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }
  postAPI(url, data?: any) {
    this.startLoader();
    const that = this;
    let baseURL = "";
    if (process.env.NODE_ENV === "development") {
      baseURL = "http://localhost:8087/price/";
    } else {
      baseURL = "/price/";
    }

    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: baseURL + url,
        // withCredentials: true,
        data: data,
        headers: {
          responseType: "arraybuffer",
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  del(url, data?: any) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        url: that.baseURL + url,
        withCredentials: true,
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  getAPI(url, data?: any) {
    this.startLoader();
    const that = this;

    let baseURL = "";
    if (process.env.NODE_ENV === "development") {
      baseURL = "http://localhost:8087/price/";
    } else {
      baseURL = "/price/";
    }

    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: baseURL + url,
        data: data,
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  put(url, data?: any) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url: that.baseURL + url,
        withCredentials: true,
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }
  postImage(url, data) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: that.baseURL + url,
        withCredentials: true,
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  postFileDownload(url, data?: any) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: that.baseURL + url,
        withCredentials: true,
        responseType: "arraybuffer",
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status == 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  postPdf(url: string, data: any) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: that.baseURL + url,
        withCredentials: true,
        data: data,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status === 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  getPdf(url: string) {
    this.startLoader();
    const that = this;
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: that.baseURL + url,
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .then((response) => {
          that.endLoader();
          if (response.data.status === 1001) {
            // history.push('/login');
            reject(new Error(response.data));
          } else if (response.data.err || response.data.errmsg) {
            reject(response);
          } else {
            resolve(response.data);
          }
        })
        .catch((resp) => {
          that.endLoader();
          reject(resp);
        });
    });
  }

  companyListForDropdownTemp(data, queryData) {
    let query = `sort=createdAt&sortType=desc&limit=${queryData.limit}`;
    if (queryData && queryData.searchText)
      query += `&Search=${encodeURIComponent(queryData.searchText)}`;
    return this.get(`company/regUser/dropdown_list?${query}`);
  }
  companyListForDropdown(queryData) {
    let query = `sort=createdAt&sortType=desc&limit=${queryData.limit}`;
    if (queryData && queryData.searchText)
      query += `&Search=${encodeURIComponent(queryData.searchText)}`;
    return this.get(`company/regUser/dropdown_list?${query}`);
  }

  assigneeList(payload) {
    try {
      let str = ``;
      if (payload?.role) {
        str += `&role=${payload?.role}`;
      }
      return this.get(
        `users/regUser/dropdown_list?isActive=1&sort=createdAt&sortType=desc` +
          str
      );
    } catch (error) {
      console.log("Error:", error);
    }
  }

  leadListForDropdown() {
    return this.get(`lead/regUser/dropdown_list?sort=createdAt&sortType=desc`);
  }

  quoteListForDropdown() {
    return this.get(`quote/regUser/dropdown_list?sort=createdAt&sortType=desc`);
  }

  consumerListForDropdown(data, queryData) {
    let query = `sort=createdAt&sortType=desc&limit=${queryData.limit}`;
    if (queryData && queryData.searchText)
      query += `&Search=${encodeURIComponent(queryData.searchText)}`;
    return this.get(`consumer/regUser/dropdown_list?${query}`);
  }

  leadListForDropdownTemp(data, queryData) {
    let query = `sort=createdAt&sortType=desc&limit=${queryData.limit}`;
    if (queryData && queryData.searchText)
      query += `&Search=${encodeURIComponent(queryData.searchText)}`;
    return this.get(`lead/regUser/dropdown_list?${query}`);
  }

  partnerList() {
    return this.get(`users/regUser/partnerList?sort=createdAt&sortType=desc`);
  }

  queryBuilder(att) {
    let queryString = "?";
    queryString += `&skip=${(att.page - 1) * att.limit}`;
    queryString += `&limit=${att.limit}`;

    if (att.showingFrom == "viewConsumer") {
      if (att.consumerId) queryString += `&Consumer=${att.consumerId}`;
    } else {
      if (att.companyId) queryString += `&Company=${att.companyId}`;
    }
    if (att.consumerID) queryString += "&Consumer=" + att.consumerID;
    if (att.supplierID) queryString += "&Supplier=" + att.supplierID;
    if (att.leadId) queryString += `&Lead=${att.leadId}`;
    if (att.quoteId) queryString += `&Quote=${att.quoteId}`;
    if (att.taskId) queryString += `&Task=${att.taskId}`;
    if (att.userId) queryString += `&User=${att.userId}`;
    if (att.renewalId) queryString += `&Renewal=${att.renewalId}`;
    if (att.supplierId) queryString += `&Supplier=${att.supplierId}`;
    if (att.searchText) {
      let searchValue = encodeURIComponent(att.searchText);
      queryString += `&Search=${searchValue.toString().replace(/%2520/g, " ")}`;
    }
    if (att.sort) queryString += `&sort=${att.sort}`;
    if (att.sortType) queryString += `&sortType=${att.sortType}`;
    if (att.dueTask) queryString += `&dueTask=true`;
    if (att.historyFor) queryString += `&historyFor=${att.historyFor}`;
    if (att.type === "live") queryString += "&isLive=1";

    if (att.filter && att.filter.role) {
      att.filter.role.map((r) => (queryString += `&role=${r}`));
    }
    if (
      att.filter &&
      (att.filter?.status || att.filter?.status === 0) &&
      att.filter.status !== -1
    ) {
      queryString += `&status=${att.filter?.status}`;
    }
    if (att.status !== undefined && att.status !== null)
      queryString += `&status=${att.status}`;
    if (att.filterData && att.filterData.completedBy) {
      queryString = `${queryString}&isComplete=1`;
    } else {
      queryString = `${queryString}&isComplete=0`;
    }
    if (att.OnlyDeleteData) queryString += `&isDelete=${true}`;

    if (att?.taskData?.TaskStatus) {
      queryString = `${queryString}&quoteStatus=${att?.taskData?.TaskStatus}`;
    }

    if (att?.filterDate?.startTime) {
      queryString = `${queryString}&startTime=${att?.filterDate?.startTime}`;
    }
    if (att?.filterDate?.Assignee) {
      queryString = `${queryString}&Assignee=${att?.filterDate?.Assignee}`;
    }
    if (att?.filterDate?.endTime) {
      queryString = `${queryString}&endTime=${att?.filterDate?.endTime}`;
    }
    if (att?.filterDate?.leadAdministrator) {
      att.filterDate?.leadAdministrator.map((item) => {
        queryString = `${queryString}&leadAdministrator=${item.value}`;
      });
    }

    if (att?.filterDate?.appointmentType) {
      att.filterDate?.appointmentType.map((item) => {
        queryString = `${queryString}&appointmentType=${item.value}`;
      });
    }

    if (att.filterData) {
      if (att.filterData.CompanyArray) {
        att.filterData.CompanyArray.map((item) => {
          queryString = `${queryString}&Company=${item}`;
        });
      }
      if (att.filterData.ConsumerArray) {
        att.filterData.ConsumerArray.map((item) => {
          queryString = `${queryString}&Consumer=${item}`;
        });
      }
      if (att.filterData.isCompanyClose) {
        queryString = `${queryString}&companyStatus=${att.filterData.isCompanyClose}`;
      }

      if (
        att.filterData.ConsumerAssignee &&
        att.filterData.ConsumerAssignee.length > 0
      ) {
        att.filterData.ConsumerAssignee.map((item) => {
          queryString = `${queryString}&Assignee=${item.value}`;
        });
      }
      if (att.filterData.Assignee) {
        queryString = `${queryString}&Assignee=${att.filterData.Assignee.value}`;
      }
      if (att.filterData.StatusArray) {
        att.filterData.StatusArray.map((item) => {
          queryString = `${queryString}&quoteStatus=${item}`;
        });
      }
      if (att.filterData.AssigneeArray) {
        att.filterData.AssigneeArray.map((item) => {
          queryString = `${queryString}&Assignee=${item}`;
        });
      }
      if (att.filterData.TaskStatus) {
        att.filterData.TaskStatus.map((item) => {
          queryString = `${queryString}&quoteStatus=${item}`;
        });
      }
      if (att.filterData.TaskType) {
        queryString = `${queryString}&taskType=${att.filterData.TaskType}`;
      }

      if (att.filterData.serviceType) {
        att.filterData.serviceType.map((item) => {
          queryString = `${queryString}&serviceType=${item.value}`;
        });
      }

      if (att.filterData.supplierType) {
        att.filterData.supplierType.map((item) => {
          queryString = `${queryString}&supplierType=${item.value}`;
        });
      }
      if (att.filterData.TaskSepType) {
        queryString = `${queryString}&taskSepType=${att.filterData.TaskSepType}`;
      }
      if (att.filterData.PartnerArray) {
        att.filterData.PartnerArray.map((item) => {
          queryString = `${queryString}&Partner=${item}`;
        });
      }
      if (att.filterData.mergedAssignee) {
        att.filterData.mergedAssignee.map((item) => {
          queryString = `${queryString}&Partner=${item.value}`;
        });
      }
      if (att.filterData.ServicesArray) {
        att.filterData.ServicesArray.map((item) => {
          queryString = `${queryString}&quoteService=${item}`;
        });
      }
      if (att.filterData.SubServicesArray) {
        att.filterData.SubServicesArray.map((item) => {
          queryString = `${queryString}&subServiceType=${item}`;
        });
      }

      if (att.filterData.DataOfArray) {
        att.filterData.DataOfArray.map((item) => {
          queryString = `${queryString}&DataOf=${item}`;
        });
      }
      if (att.filterData.blockedBy) {
        queryString = `${queryString}&blockedBy=${att.filterData.blockedBy}`;
      }
      if (att.filterData.dateTo) {
        queryString = `${queryString}&dateTo=${att.filterData.dateTo}`;
      }
      if (att.filterData.dateFrom) {
        queryString = `${queryString}&dateFrom=${att.filterData.dateFrom}`;
      }
      if (att.filterData.month) {
        queryString = `${queryString}&month=${att.filterData.month}`;
      }
      if (att.filterData.year) {
        queryString = `${queryString}&year=${att.filterData.year}`;
      }

      if (att.filterData.commissionStatus) {
        queryString = `${queryString}&commissionStatus=${att.filterData.commissionStatus.value}`;
      }
    }
    return queryString;
  }

  singleCompanyDetail(data) {
    return this.get(`company/regUser/single_show/${data.companyID}`);
  }

  singleCompanyDetailWithSite(data) {
    return this.get(`company/regUser/single_show_with_site/${data.companyID}`);
  }

  singleLeadDetailWithSite(data) {
    return this.get(`lead/regUser/single_show/${data.leadId}`);
  }

  singleConsumerDetail(data) {
    return this.get(`consumer/regUser/single_show/${data.consumerID}`);
  }

  supplierList(data) {
    return this.get(
      `supplier/${data.slug}/list?isActive=1&sort=createdAt&sortType=desc`
    );
  }

  DueDateTask() {
    return this.get(`task/regUser/due_task`);
  }
}
