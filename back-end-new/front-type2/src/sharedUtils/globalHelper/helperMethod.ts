/* eslint-disable import/prefer-default-export */
import moment from "moment";
import { QuoteStatusNames, RenewalStatusNames } from "./status";

export const helperMethods = {
  formatObjectToString(data, formatKey) {
    const combinedString = [];
    data.map((item) => {
      if (item) combinedString.push(item[formatKey]);
    });
    return combinedString.join(", ");
  },

  arrayToString(str) {
    return str.join(", ");
  },

  arrayToJoin(array) {
    const c = [];
    array.map((a) => c.push(a));
    return c.join(", ");
  },

  sortArrayOfDataInReverse(arrayOfData) {
    return arrayOfData.sort((a, b) => b.timestamps - a.timestamps);
  },

  findIntroducerID(User) {
    let IntroducerID = "";
    User.every((SingleUser) => {
      if (SingleUser.role == "5d5b92031c9d440000c99912") {
        IntroducerID = SingleUser._id;
        return false;
      }
    });
    return IntroducerID;
  },

  reverseOrder(data) {
    const temp = [...data];
    return temp.sort((x, y) => y.timestamps - x.timestamps);
  },

  closeForm(that) {
    that.closeActionHTML();
  },

  CreateStatusHistory(p, c) {
    return `Status changed from ${p} to ${c}`;
  },

  ConvertDateAndTime(t) {
    const date = new Date(t);
    const day = date.getDate();
    const month = Number(date.getMonth()) + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${this.pad(day)}/${this.pad(month)}/${year} ${this.pad(
      hour
    )}:${this.pad(minute)}`;
  },

  ConvertDate(t) {
    if (t === undefined || Number.isNaN(t)) return;
    return `${new Date(t).toLocaleDateString("en-GB")}`;
  },

  ColorForDate1(dueDate) {
    let value = dueDate;
    let color = "none";
    const now = new Date();
    const parts = value.split("/");
    const d = new Date(parts[2], parts[1] - 1, parts[0]); // y-m-d

    if (
      now.getTime() < d.getTime() &&
      d.getTime() < now.getTime() + 172800000
    ) {
      color = "DueDateColorRed";
    } else if (
      now.getTime() + 172800000 < d.getTime() &&
      d.getTime() < now.getTime() + 345600000
    ) {
      color = "DueDateColorLightRed";
    }
    return color;
  },

  SwapDtoM(dueDate) {
    // swapping date to month in view date
    let v = "";
    if (String(dueDate).includes("/")) {
      const parts = dueDate.split("/");
      v = `${parts[1]}/${parts[0]}/${parts[2]}`;
    } else {
      v = dueDate;
    }
    return v;
  },

  ColorForDate(dueDate) {
    // color code for due date in the task table
    let value = `${new Date(dueDate).toLocaleDateString("en-GB")}`;
    let color = "none";
    const now = new Date();
    const parts = value.split("/");
    const d = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    ); // y-m-d

    if (
      now.getTime() < d.getTime() &&
      d.getTime() < now.getTime() + 172800000
    ) {
      color = "DueDateColorRed";
    } else if (
      now.getTime() + 172800000 < d.getTime() &&
      d.getTime() < now.getTime() + 345600000
    ) {
      color = "DueDateColorLightRed";
    }
    return color;
  },

  MillisecondsToDate(m) {
    return moment(Number(m)).format("DD/MM/YYYY");
  },

  MillisecondsToDate_NewOne(m) {
    return moment(Number(m)).format("MM/DD/YYYY");
  },

  URLCreator() {
    let url = "";
    if (process.env.NODE_ENV === "development") {
      // url = process.env.ENVIRONMENTS.DEVELOPMENT_BACKEND_URL
      url = "https://thepowerportal.co.uk/api/";
    } else {
      url = "/api/";
    }
    return url;
  },

  DownloadInvoice(downloadFor, QuoteID) {
    window.open(`${this.URLCreator()}${downloadFor}/quoteInvoice/${QuoteID}`);
  },

  downloadAttachment(name, file) {
    window.open(`${this.URLCreator()}task/download_attachment/${file}`);
  },

  meterReadingDownload(name, file) {
    window.open(`${this.URLCreator()}company/download_attachment/${file}`);
  },

  replaceQueryString(query) {
    const mapObj = {
      createdAt: "DueDate",
      desc: "asc",
    };
    return query.replace(/createdAt|desc/gi, (matched) => mapObj[matched]);
  },

  TaskActionMethod(that, action) {
    const { toast, loaderStart, loaderEnd } = that.props;
    if (action === "TaskRequest") {
      if (that.user !== undefined && that.user === "admin") {
        toast("Task deleted successfully");
      } else {
        toast("Task delete request sent successfully");
      }
      loaderEnd();
    } else if (action === "loaderStart") {
      loaderStart();
    } else if (action === "loaderEnd") {
      loaderEnd();
    }
  },

  pad(num) {
    return `0${num}`.slice(-2);
  },

  // Merge Date and Time for Calendar Tasks
  mergeDateTime(date, time) {
    const T = new Date(time)
    const D = new Date(date)
    try {

      var mergeDate = new Date(D);
      mergeDate.setHours(T.getHours());
      mergeDate.setMinutes(T.getMinutes());
    }
    catch (error) {
      console.log("Error In Date and Time merge", error)
    }
    return mergeDate;
  },

  getTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${Number(hours)}:${this.pad(minutes)}`;
  },

  downloadAnyDocument(apiURL) {
    const link = document.createElement("a");
    link.href = `${helperMethods.URLCreator()}${apiURL}`;
    link.download = `${helperMethods.URLCreator()}${apiURL}`.substr(
      `${helperMethods.URLCreator()}${apiURL}`.lastIndexOf("/") + 1
    );
    link.click();
  },

  toFixedWith2DIgit(value) {
    return Number(value).toFixed(2);
  },

  formatArrayToString(data, formatKey) {
    const combinedString = [];
    data.map((item) => {
      if (item) {
        combinedString.push(item[formatKey]);
      }
    });
    return combinedString.join(", ");
  },

  specificServiceSupplier(data, serviceType, action) {
    let suppliers = [];
    data.filter((e) => {
      if (e.serviceType && e.serviceType.includes(String(serviceType))) {
        if (action && action === "edit") {
          suppliers.push({
            label: e.supplierName,
            value: e.supplierName,
            id: e._id,
          });
        } else {
          suppliers.push({ label: e.supplierName, value: e._id });
        }
      }
    });
    return suppliers;
  },

  isCallNextApi(fieldArray, obj) {
    // if required to call table list API while update single data
    const hasContain = fieldArray.filter((prop) => obj.hasOwnProperty(prop));
    return hasContain && hasContain.length > 0;
  },

  columnCreator(data) {
    const co: any = {};
    if (data.title) co.title = data.title;
    if (data.field) co.field = data.field;
    if (data.sorting) co.sorting = true;
    if (data.headerStyle) co.headerStyle = data.headerStyle;
    if (data.renderData) co.render = data.renderData;
    return co;
  },

  debounce(func, wait) {
    // using debounce for the lazy load
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  },

  generateNumber(number, range) {
    if (number === undefined || !number) return true;
    const num = Number(number);
    let str = `${number} \n`;
    for (let index = 1; index < Number(range); index++) {
      str += `${num + index} \n`;
    }
    return str;
  },

  getTimeOnly(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    // return `${Number(hours)}:${this.pad(minutes)}`;
    return strTime;
  },
  getTimeOnlyNew(timestamp) {
    return moment(timestamp).format('h:mm A').toString();
  },
  getTodayDate(timestamp) {
    var date = new Date(timestamp);
    var today = new Date();
    var yesterday = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    var d = String(date.getDate()).padStart(2, "0");
    var m = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var y = date.getFullYear();

    yesterday.setDate(yesterday.getDate() - 1);

    today = new Date(dd + "/" + mm + "/" + yyyy);
    date = new Date(d + "/" + m + "/" + y);

    if (today === date) {
      return "TODAY";
    } else {
      if (date === yesterday) {
        return "Yesterday";
      } else {
        return date;
      }
    }
  },
  checkDate(date) {
    var REFERENCE = moment(new Date()); // fixed just for testing, use moment();
    var TODAY = REFERENCE.clone().startOf('day');
    var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
    var A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
    if (moment(date).isSame(TODAY, 'd')) {
      return 'TODAY'
    } else if (moment(date).isSame(YESTERDAY, 'd')) {
      return 'YESTERDAY'
    } else {
      return String(moment(new Date(date)).format('DD/MM/YYYY'))
    }
  },
  EventTypeCreator(data) {
    // event type creator based on the value in history table
    let event = "";
    if (
      ["isBlock", "isDelete", "status"].includes(data.field) ||
      (data.status && data.editedBy && data.timestamps)
    )
      event = `Status`;
    else if (["passwordEdit"].includes(data.field)) event = `Password`;
    else if (["soldService"].includes(data.field)) event = `Service Sold`;
    else if (
      [
        "Comment",
        "comment",
        "Document",
        "create",
        "Delete",
        "Assignee",
        "Create",
        "Site Contact",
        "Meter reading",
        "Observer",
        "Reminder",
        "Attachment",
        "Supplier",
        "Quote Action",
        "Renewal Action",
        "Document Sent",
        "Document Received"
      ].includes(data.field)
    )
      event = `${String(data.field).toUpperCase()}`;
    else event = `Field modified: ${String(data.field).toUpperCase()}`;
    return event;
  },

  DescriptionCreator(data) {
    // description creator based on the value in history table
    let description = "";
    if (["isBlock"].includes(data.field))
      description = `User ${(data.currentValue.replace(/\+[0-9]+/g, "")) ? "blocked" : "activated"}`;
    else if (["isDelete"].includes(data.field))
      description = `User ${(data.currentValue.replace(/\+[0-9]+/g, "")) ? "delete request sent" : "delete request cancelled"
        }`;
    else if (["passwordEdit"].includes(data.field))
      description = `Password updated`;
    else if (["Quote Action"].includes(data.field))
      description = QuoteStatusNames[Number(data.currentValue.replace(/\+[0-9]+/g, ""))];
    else if (["Renewal Action"].includes(data.field))
      description = RenewalStatusNames[Number(data.currentValue.replace(/\+[0-9]+/g, ""))];
    else if (["soldService"].includes(data.field))
      description = `${data.currentValue} service sold out`;
    else if (["serviceType"].includes(data.field))
      description = `${data.previousValue ? this.arrayToString(data.previousValue.solar ? "" : data.previousValue.replace(/\+[0-9]+/g, "")) : "NULL"
        } -> ${data.currentValue ? this.arrayToString(data.currentValue.replace(/\+[0-9]+/g, "")) : "NULL"
        }`;
    else if (data.status && data.editedBy && data.timestamps)
      description = `${data.status}`;
    else if (
      [
        "create",
        "Create",
        "Document",
        "Delete",
        "comment",
        "Comment",
        "Assignee",
        "Site Contact",
        "Meter reading",
        "Observer",
        "Reminder",
        "Attachment",
        "Supplier",
        "Document Sent",
        "Document Received"
      ].includes(data.field)
    )
      description = `${data.currentValue.replace(/\+[0-9]+/g, "")}`;
    else if (["DOB", "creditScoreDate", "DueDate"].includes(data.field))
      description = `${data.previousValue ? this.ConvertDate(data.previousValue.solar ? "" : data.previousValue.replace(/\+[0-9]+/g, "")) : "NULL"
        } -> ${data.currentValue ? this.ConvertDate(data.currentValue.replace(/\+[0-9]+/g, "")) : "NULL"}`;
    else if (["isCompanyClose"].includes(data.field)) {

      if (data.previousValue === true && data.currentValue === false) {
        description = `Closed -> Open`
      }
      else if (data.previousValue === false && data.currentValue === true) {
        description = `Open -> Closed`
      }
      else {
        description = `${data.previousValue ? (data.previousValue.solar ? "" : data.previousValue.replace(/\+[0-9]+/g, "")) : "NULL"} -> ${data.currentValue ?
          (data.currentValue.solar ? "NULL" : data.currentValue.replace(/\+[0-9]+/g, "")) : "NULL"}`
      }
    }

    else if (
      [
        "Preferred contract start date",
        "Current contract end date",
        "Bill start date",
        "Bill end date",
        "Water renewal date",
        "PCI complaint date",
        "Renewal date",
        "First transaction date",
        "Delivery date",
        "Telecoms renewal date",
        "Telecoms live date",
        "Programmed date",
        "Broadband live date",
        "Broadband renewal date",
        "Valuation date",
        "Completion date",
        "Contract exchange date",
        "Date of offer",
        "ExpiryDate",
      ].includes(data.field)
    )
      description = `${data.previousValue
        ? this.MillisecondsToDate(data.previousValue)
        : "NULL"
        } -> ${data.currentValue ? this.MillisecondsToDate(data.currentValue) : "NULL"
        }`;
    else if (["Time"].includes(data.field))
      description = `${data.previousValue ? this.getTimeFromDate(data.previousValue.solar ? "" : data.previousValue.replace(/\+[0-9]+/g, "")) : "NULL"
        } -> ${data.currentValue ? this.getTimeFromDate(data.currentValue.replace(/\+[0-9]+/g, "")) : "NULL"
        }`;
    else
      description = `${data.previousValue ? (data.previousValue.solar ? "" : data.previousValue.replace(/\+[0-9]+/g, "")) : "NULL"} -> ${data.currentValue ? data.currentValue.replace(/\+[0-9]+/g, "") : "NULL"
        }`;
    return description;
  },
};
