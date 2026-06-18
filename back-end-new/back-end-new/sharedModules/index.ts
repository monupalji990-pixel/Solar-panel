//models
const models: any = {};
models.mongoSchemaObject = require("mongoose").Schema.ObjectId;
models.mongoObject = require("mongoose").Types.ObjectId;

//constants
const constantsModules: any = {};
import importResponseCode from "./constants/responseStatusCodes";
import importProjection from "./constants/projection";
constantsModules.responseCode = importResponseCode;
constantsModules.projection = importProjection;

//small modules
const smallModules: any = {};
import importMail from "./smallModules/mail";
import importAws from "./smallModules/aws";
import importGeneral from "./smallModules/general";
import importResponse from "./smallModules/responses";
// outlookGraph (Azure/Microsoft Graph) intentionally NOT imported at startup.
// This prevents loading @azure/identity in environments where it is not supported/needed.
smallModules.mail =importMail;
smallModules.aws =importAws;
smallModules.general = importGeneral;
smallModules.responseModule =importResponse;


//database modules
const modules = {};

//controllers
const controllers = {};

//project based modules
const project = {};

export default {
  modules,
  controllers,
  project,
  constantsModules,
  models,
  smallModules,
};
