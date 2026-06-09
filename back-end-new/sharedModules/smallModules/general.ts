const mongoObject = require("mongoose").Types.ObjectId;
const formateDate = (dt: {
  getDate: () => string;
  getMonth: () => string;
  getFullYear: () => string;
}) => {
  return dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear();
};
const commonFindQuery = (collection: any, query: any) => {
  if (query.skip) {
    collection.skip(parseInt(query.skip));
  }
  if (query.limit) {
    collection.limit(parseInt(query.limit));
  }
  if (query.sort) {
    var sortType = query.sortType == "asc" ? 1 : -1;
    collection.sort([[query.sort, sortType]]);
  }
  return collection;
};

const checkResetId = (obj: { timestamp: any }) => {
  const date = obj.timestamp;
  const currentDate = new Date();
  if (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate() &&
    date.getHours() === currentDate.getHours()
  ) {
    if (currentDate.getMinutes() < date.getMinutes() + 10) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const getDayFromDate = function (date: Date) {
  const dayNumber = date.getDay();
  switch (dayNumber) {
    case 0:
      return "sunday";
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
  }
};
const addIdFilter = async function (filter: any, searchKeys: any, query: any) {
  searchKeys.forEach((key: any) => {
    if (query[key]) {
      if (typeof query[key] === 'string') {
        filter[key] = mongoObject(query[key])
      }
      if (typeof query[key] === 'object') {
        let ca: any = [];
        query[key].filter((c: any) => { ca.push(mongoObject(c)) })
        filter[key] = { $in: ca }
      };
    };
  })
  return filter
}
const addIdFilterWithOr = async function (filter: any, searchKeys: any, query: any) {
  searchKeys.forEach((key: any) => {
    if (query[key]) {
      filter["$or"] = filter["$or"] || []
      if (typeof query[key] === 'string') {
        filter["$or"].push({ [key]: mongoObject(query[key]) })
      }
      if (typeof query[key] === 'object') {
        let ca: any = [];
        query[key].filter((c: any) => { ca.push(mongoObject(c)) })
        filter["$or"].push({ [key]: { $in: ca } })
      };
    };
  })
  return filter
}
const addKeyFilter = async function (filter: any, searchKeys: any, query: any) {
  searchKeys.forEach((key: any) => {
    if (query[key]) {
      if (typeof query[key] === 'string') {
        filter[key] = query[key]
      }
      if (typeof query[key] === 'object') {
        filter[key] = { $in: query[key] }
      };
    };
  })
  return filter
}
const commonFindQueryForAggregate = (pipeline: any, query: any) => {
  if (query.sort) {
    var sortType = query.sortType == "asc" ? 1 : -1;
    if (query.insensitive) {
      pipeline.push({
        $sort: {
          "insensitive": sortType   // adding this for case insensitive search
        }
      })
    } else {
      pipeline.push({
        $sort: {
          [query.sort]: sortType
        }
      })
    }
  }
  if (query.skip) {
    pipeline.push({ $skip: parseInt(query.skip) })
  }
  if (query.limit) {
    pipeline.push({ $limit: parseInt(query.limit) })
  }
  return pipeline;
};
const execWithCommonAggregate = async (collection: any, pipeLine: any, query: any) => {
  query.limit ? query.limit = Number(query.limit) + 1 : query.limit = 11;

  commonFindQueryForAggregate(pipeLine, query);
  const data = await collection.aggregate(pipeLine);
  let isNext = false;

  if (data.length === query.limit) {
    isNext = true;
    data.pop();
  }
  return { data, isNext };
};
const addSearchFilterWithOr = async function (filter: any, searchKeys: any, search: any) {
  if (search) {
    let regexObj = { $regex: new RegExp(`.*${searchParse(search)}.*`, "i") };
    filter["$or"] = []
    searchKeys.forEach((key: any) => { filter["$or"].push({ [key]: regexObj }) })
  }
  return filter
}
const searchParse = function (search: any) {
  ['[', ']', '{', '}', '(', ')', '*', '&'].forEach((sym: any) => {
    if (search?.includes(sym)) {
      search = search.replace(sym, ".")
    }
  })
  console.log("search==>", search);

  return search;
}
const keyValueObj: any = {
  title: 'Title'
};
const checkKeyValidation = (body: any, keys: any) => {
  keys.forEach((key: any) => {
    if (!body[key]) {
      const value = keyValueObj[key] || key;
      throw { errmsg: `${value} is required.`, type: 'Logical' };
    }
  });
};
const checkIdValidation = (body: any, keys: any) => {
  keys.forEach((key: any) => {
    if (!body[key] || !mongoObject.isValid(body[key])) { throw { errmsg: `A valid ${key} is required.`, type: 'Logical' }; }
  });
};
const addLookup = (collection: any, localField: any, foreignField: any, projectKeys: any, key: any, isArray: Boolean) => {
  const refkey = key || localField;
  const projectObj: any = {};
  const matchBy = isArray ? '$in' : '$eq'
  projectKeys.forEach((e: any) => { projectObj[e] = 1; });
  return {
    $lookup: {
      from: collection,
      let: { [`${refkey}`]: `$${localField}` },
      pipeline: [
        { $match: { $expr: { [`${matchBy}`]: [`$${foreignField}`, `$$${refkey}`] } } },
        { $project: projectObj },
      ],
      as: `${localField}`,
    },
  };
};
const addUnwind = (key: any, preserveValue: any) => ({ $unwind: { path: `$${key}`, preserveNullAndEmptyArrays: preserveValue ? true : false } });

export default {
  checkResetId,
  commonFindQuery,
  formateDate,
  getDayFromDate,
  addIdFilter,
  addIdFilterWithOr,
  addKeyFilter,
  execWithCommonAggregate,
  addSearchFilterWithOr,
  checkKeyValidation,
  checkIdValidation,
  addLookup,
  addUnwind
};
