export {};
const responseStatusCode = require("../constants/responseStatusCodes");

interface Error {
  code: number;
  errmsg: string;
  success: boolean;
}
const sendResponse = (
  res: { send: (arg0: any) => void },
  data: { success: boolean; err: { code: number; errmsg: string } }
) => {
  if (data.success == false) {
    var err = {} as Error;
    switch (data.err.code) {
      case responseStatusCode.duplicateentry:
        err.code = data.err.code;
        err.errmsg = data.err.errmsg;
        break;
    }
    err.success = false;
    res.send(err);
  } else {
    res.send(data);
  }
};
export default {
  sendResponse,
};
