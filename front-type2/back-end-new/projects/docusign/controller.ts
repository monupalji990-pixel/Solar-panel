import UserModel from "../../models/user";
import DocusignModel from "../../models/Docusign";
import DocusignAuditModel from "../../models/AuditEvents";
import QuoteModel from "../../models/Quotes";
import DocumentTimelineModel from "../../models/DocumentTimeline";
import { Request, Response } from "../../templates/commandInterface";
import CompanyModel from "../../models/Company";
import SupplierModel from "../../models/Supplier";
import aws from "../../sharedModules/smallModules/aws";
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
let moment = require("moment"),
  fs = require("fs"),
  docusign = require("docusign-esign"),
  dsConfig = require("./config/index").config,
  tokenReplaceMin = 10, // The accessToken must expire at least this number of
  tokenReplaceMinGet = 30,
  rsaKey = "temp" 

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  let temp = dsConfig.dsOauthServer;
  dsConfig = dsConfig.development;
  dsConfig.dsOauthServer = "https://account-d.docusign.com"
  rsaKey = fs.readFileSync(__dirname + "/config/private.txt");
}
if (process.env.NODE_ENV === "staging") {
  let temp = dsConfig.dsOauthServer;
  dsConfig = dsConfig.staging;
  dsConfig.dsOauthServer = "https://account-d.docusign.com";
  rsaKey = fs.readFileSync(__dirname + "/config/private.txt");
}
if (process.env.NODE_ENV === "production") {
  let temp = dsConfig.dsOauthServer;
  dsConfig = dsConfig.production;
  dsConfig.dsOauthServer = "https://account.docusign.com";
  rsaKey = fs.readFileSync(__dirname + "/config/prodPrivate.txt");
}

class AuthController {
  async getToken(req: Request, res: any) {
    try {
      const scopes = "signature";
      let auth_data: any = {};
      const jwtLifeSec = 1000 * 60, // requested lifetime for the JWT is 10 min
        dsApi = new docusign.ApiClient();
      dsApi.setOAuthBasePath(dsConfig.dsOauthServer.replace("https://", "")); // it should be domain only.
      const results = await dsApi.requestJWTUserToken(
        dsConfig.dsClientId,
        dsConfig.impersonatedUserGuid,
        scopes,
        rsaKey,
        jwtLifeSec
      );
      const expiresAt = moment()
        .add(results.body.expires_in, "s")
        .subtract(tokenReplaceMin, "m");
      auth_data.accessToken = results.body.access_token;
      auth_data.tokenExpireAt = expiresAt;
      const targetAccountId = dsConfig.targetAccountId;
      const baseUriSuffix = "/restapi";

      const userData = await dsApi.getUserInfo(results.body.access_token);

      let accountInfo;
      if (!Boolean(targetAccountId)) {
        // find the default account
        accountInfo = userData.accounts.find(
          (account) => account.isDefault === "true"
        );
      } else {
        // find the matching account
        accountInfo = userData.accounts.find(
          (account) => account.accountId == targetAccountId
        );
      }
      if (typeof accountInfo === "undefined") {
        throw new Error(`Target account ${targetAccountId} not found!`);
      }
      auth_data.accountId = accountInfo.accountId;
      auth_data.accountName = accountInfo.accountName;
      auth_data.basePath = accountInfo.baseUri + baseUriSuffix;
      let dpop = await DocusignModel.findOneAndUpdate(
        { userId: req.user._id },
        { data: auth_data },
        { upsert: true, new: true }
      ).lean();
      return auth_data;
    } catch (error) {
      let body = error.response && error.response.body;

      console.log(error);
      if (body) {
        // DocuSign API problem
        if (body.error && body.error === "consent_required") {
          // Consent problem
          let consent_scopes = "signature" + " impersonation",
            consent_url =
              `${dsConfig.dsOauthServer}/oauth/auth?response_type=code&` +
              `scope=${consent_scopes}&client_id=${dsConfig.dsClientId}&` +
              `redirect_uri=${dsConfig.appUrl}`;

          res.send({ success: false, redirect_url: consent_url });
        } else {
          res.send({
            success: false,
            message: "Error from docusign " + error.response.status,
          });
        }
      } else {
        // Not an API problem

        res.send({ success: false, message: error.message });
      }
    }
  }
}

class AdminController {
  async getToken(req: Request, res: Response) {
    try {
      const scopes = "signature";
      let auth_data: any = {};
      const jwtLifeSec = 1000 * 60, // requested lifetime for the JWT is 10 min
        dsApi = new docusign.ApiClient();
      dsApi.setOAuthBasePath(dsConfig.dsOauthServer.replace("https://", "")); // it should be domain only.
      const results = await dsApi.requestJWTUserToken(
        dsConfig.dsClientId,
        dsConfig.impersonatedUserGuid,
        scopes,
        rsaKey,
        jwtLifeSec
      );

      const expiresAt = moment()
        .add(results.body.expires_in, "s")
        .subtract(tokenReplaceMin, "m");
      auth_data.accessToken = results.body.access_token;
      auth_data.tokenExpireAt = expiresAt;
      const targetAccountId = dsConfig.targetAccountId;
      const baseUriSuffix = "/restapi";

      const userData = await dsApi.getUserInfo(results.body.access_token);

      let accountInfo;
      if (!Boolean(targetAccountId)) {
        // find the default account
        accountInfo = userData.accounts.find(
          (account) => account.isDefault === "true"
        );
      } else {
        // find the matching account
        accountInfo = userData.accounts.find(
          (account) => account.accountId == targetAccountId
        );
      }
      if (typeof accountInfo === "undefined") {
        throw new Error(`Target account ${targetAccountId} not found!`);
      }
      auth_data.accountId = accountInfo.accountId;
      auth_data.accountName = accountInfo.accountName;
      auth_data.basePath = accountInfo.baseUri + baseUriSuffix;
      let dpop = await DocusignModel.findOneAndUpdate(
        { userId: req.user._id },
        { data: auth_data },
        { upsert: true, new: true }
      ).lean();

      return auth_data;
    } catch (error) {
    }
  }

  async listTemplates(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({ userId: req.user._id });
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let templatesApi = new docusign.TemplatesApi(dsApiClient);
      let listOfTemplates = await templatesApi.listTemplates(
        docuData.data.accountId, { count: "15", startPosition: (req.query.skip == undefined || isNaN(req.query.skip)) ? 0 : req.query.skip }
      );
      listOfTemplates.message = "Template list fetch successfully";

      res.send(listOfTemplates);
    } catch (error) {
      let body = error.response && error.response.body;
      if (body) {
        // DocuSign API problem
        if (body.error && body.error === "consent_required") {
          // Consent problem
          let consent_scopes = "signature" + " impersonation",
            consent_url =
              `${dsConfig.dsOauthServer}/oauth/auth?response_type=code&` +
              `scope=${consent_scopes}&client_id=${dsConfig.dsClientId}&` +
              `redirect_uri=${dsConfig.appUrl}`;

          res.send({ success: false, redirect_url: consent_url });
        } else {
          res.send({
            success: false,
            message: "Error from docusign " + error.response.status,
          });
        }
      } else {
        // Not an API problem

        res.send({ success: false, message: error.message });
      }
    }
  }

  async viewTemplate(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let templatesApi = new docusign.TemplatesApi(dsApiClient);

      let template = await templatesApi.get(
        docuData.data.accountId,
        req.body.tempId
      );
      template.message = "Template fetch sucessfully";
      res.send(template);
    } catch (error) {
      let body = error.response && error.response.body;
      if (body) {
        // DocuSign API problem
        if (body.error && body.error === "consent_required") {
          // Consent problem
          let consent_scopes = "signature" + " impersonation",
            consent_url =
              `${dsConfig.dsOauthServer}/oauth/auth?response_type=code&` +
              `scope=${consent_scopes}&client_id=${dsConfig.dsClientId}&` +
              `redirect_uri=${dsConfig.appUrl}/ds/callback`;

          res.redirect(consent_url);
        } else {
          res.send({
            success: false,
            message: "Error from docusign " + error.response.status,
          });
        }
      } else {
        // Not an API problem

        res.send({ success: false, message: error.message });
      }
    }
  }

  async listTabsOfTemplate(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let templatesApi = new docusign.TemplatesApi(dsApiClient);


      let template = await templatesApi.listTabs(
        docuData.data.accountId,
        req.body.tempId,
        req.body.recipientId
      );
      res.send(template);
    } catch (error) {
      res.send({ success: false, message: error.message });

    }
  }

  async viewTemplateReceipients(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let templatesApi = new docusign.TemplatesApi(dsApiClient);

      let templetRecipients = await templatesApi.listRecipients(
        docuData.data.accountId,
        req.body.tempId
      );

      let finalRes = [];
      let senderId = null;
      Object.keys(templetRecipients).forEach((element) => {
        if (
          templetRecipients[element].length > 0 &&
          typeof templetRecipients[element] == "object"
        ) {
          templetRecipients[element].forEach((recipient) => {
            if (recipient.roleName) {
              // console.log(recipient.roleName);
              if (recipient.recipientId && recipient.roleName.toLowerCase() === 'edanpower') {
                senderId = recipient.recipientId;
              }
              finalRes.push(recipient.roleName);
            }
          });
        }
      });
      let tabs = await templatesApi.listTabs(
        docuData.data.accountId,
        req.body.tempId,
        senderId
      );
      res.send({ recipientList: finalRes, tabs: tabs });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  }

  async useTemplate(req: Request, res: Response) {
    try {
      console.log(req.body)
      if (!req.body.type) {
        throw { message: "Type required" }
      }
      if (req.body.type == 'company' && !req.body.companyId) {
        throw { message: "Company Id required" };
      }
      if (req.body.type == 'quote' && !req.body.quoteId) {
        throw { message: "Quote Id required" };
      }
      if (req.body.type == 'renewal' && !req.body.renewalId) {
        throw { message: "Renewal Id required" };
      }
      if (req.body.type == 'consumer' && !req.body.consumerId) {
        throw { message: "Consumer Id required" };
      }
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);
      let envelope = new docusign.EnvelopeDefinition();
      envelope.templateId = req.body.tempId;
      envelope.status = "sent";
      envelope.templateRoles = req.body.recipients;

      let result = await envelopeApi.createEnvelope(docuData.data.accountId, {
        envelopeDefinition: envelope,
      });
      let digitalDocument = new DocumentTimelineModel();
      digitalDocument.sentBy = req.user._id;
      digitalDocument.mode = "Docusign";
      digitalDocument.sentDocumentTimestamp = moment.now()
      if (req.body.type === "quote") {
        digitalDocument.quoteId = req.body.quoteId;
      } else if (req.body.type === "company") {
        digitalDocument.companyId = req.body.companyId;
      }
      else if (req.body.type === "renewal") {
        digitalDocument.renewalId = req.body.renewalId;
      }else if (req.body.type === "consumer"){
        digitalDocument.consumerId = req.body.consumerId;
      }
      digitalDocument.docusignEnvId = result.envelopeId;
      digitalDocument.docusignEmailSubject = req.body.emailSubject;

      await digitalDocument.save()

      result.message = "Envelope send successfully";
      result.success = true;
      res.send(result);
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }

  async getQuoteEnvelopes(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);
      let quote = await QuoteModel.findOne({ _id: req.body.quoteId }).select(
        "docusignHistory"
      );
      let quoteEnvelopesData = [];
      let data = [];
      if (quote.docusignHistory && quote.docusignHistory.length > 0) {
        for (const env of quote.docusignHistory) {
          let envData = await envelopeApi.getEnvelope(
            docuData.data.accountId,
            env.envId
          );
          data.push({ envData: envData });
        }
      }
      res.send({ data: data, message: "Docusign data fetch successfully." });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  }

  async getEnvelopeDetails(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);

      let envelope = await envelopeApi.getEnvelope(
        docuData.data.accountId,
        req.body.envelopeId
      );
      let recipients = await envelopeApi.listRecipients(
        docuData.data.accountId,
        req.body.envelopeId
      );
      res.send({ envelope: envelope, recipients: recipients });
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }

  async getEnvelopeStatusDetails(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);

      // let envelope = await envelopeApi.getEnvelope(docuData.data.accountId,req.body.envelopeId);
      let recipients = await envelopeApi.listRecipients(
        docuData.data.accountId,
        req.body.envelopeId
      );
      res.send(recipients);
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }
  async auditEvents(req: Request, res: Response) {
    try {
      let tempAuditEvent = await DocusignAuditModel.findOne({
        envId: req.body.envId,
      });
      if (tempAuditEvent) {
        let diffMinutes = Math.round(
          (new Date().getTime() -
            new Date(tempAuditEvent.updatedAt).getTime()) /
          60000
        );
        console.log("difference in minutes: ", diffMinutes);
        if (diffMinutes < 17) {
          console.log("from cache");
          tempAuditEvent = await DocusignAuditModel.findOne({
            envId: req.body.envId,
          }).lean();
          if (tempAuditEvent?.data?.auditEvents)
            return res.send({
              auditEvents: tempAuditEvent.data.auditEvents,
              message: "Audit Events fetch sucessfully",
              documentUrl: tempAuditEvent.documentUrl,
              envStatus: tempAuditEvent.envStatus
            });
        }

      }
      console.log("getting audit events");
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();

      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      let auditEvents = await envelopesApi.listAuditEvents(
        docuData.data.accountId,
        req.body.envId
      );

      await DocusignAuditModel.findOneAndUpdate(
        { envId: req.body.envId },
        { data: auditEvents },
        { upsert: true, new: true }
      ).lean();

      let tempAuditData = await DocusignAuditModel.findOne({ envId: req.body.envId });
      if (!tempAuditData?.documentUrl) {
        console.log('calling download function');

        let result = await new AdminController().downloadDocumentFromEnvelopeFunction(req, req.body.envId);

        if (result?.documentUrl) {
          let documentTimelineForDocusign = await DocumentTimelineModel.updateOne({ docusignEnvId: req.body.envId }, { docusignEnvDocumentUrl: result.documentUrl });

          tempAuditData.documentUrl = result.documentUrl;
          auditEvents.documentUrl = result.documentUrl;
        }
        if (result?.envStatus) {
          tempAuditData.envStatus = result.envStatus;
          auditEvents.envStatus = result.envStatus;
        }
        await tempAuditData.save();
      } else {
        if (tempAuditData?.documentUrl)
          auditEvents.documentUrl = tempAuditData.documentUrl;
        if (tempAuditData?.envStatus)
          auditEvents.envStatus = tempAuditData.envStatus;
      }
      auditEvents.message = "Audit Events fetch sucessfully";
      res.send(auditEvents);
    } catch (error) {
      console.log(error);

      let body = error.response && error.response.body;
      if (body) {
        // DocuSign API problem
        if (body.error && body.error === "consent_required") {
          // Consent problem
          let consent_scopes = "signature" + " impersonation",
            consent_url =
              `${dsConfig.dsOauthServer}/oauth/auth?response_type=code&` +
              `scope=${consent_scopes}&client_id=${dsConfig.dsClientId}&` +
              `redirect_uri=${dsConfig.appUrl}/ds/callback`;

          res.redirect(consent_url);
        } else {
          res.send({
            success: false,
            message: "Error from docusign " + error.response.status,
          });
        }
      } else {
        // Not an API problem

        res.send({ success: false, message: error.message });
      }
    }
  }
  async listAttachmentsOfEnvelopes(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);
      let attachments = await envelopeApi.listDocuments(
        docuData.data.accountId,
        req.body.envId
      );
      console.log(attachments);

      res.send(attachments);
    } catch (error) {
      console.log(error);
    }
  }

  async downloadDocumentFromEnvelope(req: Request, res: Response) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();
      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, res);
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);
      let results = await envelopeApi.getDocument(
        docuData.data.accountId,
        req.body.envId,
        "combined",
        {
          certificate: true
        }
      );
      let mimetype;
      if (true) {
        mimetype = "application/pdf";
      }
      var bLength = results.length;
      var bytes = new Uint8Array(bLength);
      // let bytes = new Array(bLength);

      for (let i = 0; i < bLength; i++) {
        let ascii = results.charCodeAt(i);
        bytes[i] = ascii;
      }
      fs.writeFileSync(__dirname + "/docusign.pdf", bytes);

      res.send({ mimetype, docName: "tempName.pdf", filtBytes: results, success: true });
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }

  async downloadDocumentFromEnvelopeFunction(req: Request, envId: String) {
    try {
      let docuData = await DocusignModel.findOne({
        userId: req.user._id,
      }).lean();

      if (
        docuData === null ||
        moment(docuData.data.tokenExpireAt) < moment.now()
      ) {
        console.log("in reneal of token logic");
        let controller = await new AuthController();
        await controller.getToken(req, {});
        docuData = await DocusignModel.findOne({ userId: req.user._id }).lean();
      }

      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(docuData.data.basePath);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + docuData.data.accessToken
      );
      let envelopeApi = new docusign.EnvelopesApi(dsApiClient);
      let envelope = await envelopeApi.getEnvelope(
        docuData.data.accountId,
        envId
      );
      console.log(envelope)

      if (envelope?.status === "completed") {


        let results = await envelopeApi.getDocument(
          docuData.data.accountId,
          envId,
          "combined",
          {
            certificate: true
          }
        );
        let mimetype;
        if (true) {
          mimetype = "application/pdf";
        }
        var bLength = results.length;
        var bytes = new Uint8Array(bLength);

        for (let i = 0; i < bLength; i++) {
          let ascii = results.charCodeAt(i);
          bytes[i] = ascii;
        }
        let response = await aws.putUnit8Array(req, bytes, { filename: envId, contentType: 'application/pdf' })
        console.log(response);
        return { documentUrl: response.Location, envStatus: envelope?.status }
      }
      else {
        return { envStatus: envelope?.status }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async downloadAllCompletedDocumentsForCompany(req: Request, companyId: string) {
    try {
      console.log('------------------------------------------------------------------------------------');

      let companyDocumentTimeline = await DocumentTimelineModel.find({
        companyId: companyId, mode: "Docusign",
        docusignEnvDocumentUrl: { $exists: false }
      }).select("docusignEnvId docusignEmailSubject lastAccessedAt")
        .limit(20);

      console.log("Docusign env id for documents", companyDocumentTimeline.length);
      console.log(companyDocumentTimeline);

      let documentsArray = [];
      for (let document of companyDocumentTimeline) {
        let diffMinutes = Math.round(
          (new Date().getTime() -
            new Date(document.lastAccessedAt).getTime()) /
          60000
        );
        console.log("diff min ", diffMinutes, "envID : ", document.docusignEnvId)
        if (document?.lastAccessedAt && !isNaN(diffMinutes) && diffMinutes > 17) {
          //check and download
          document.lastAccessedAt = new Date();
          let result = await new AdminController().downloadDocumentFromEnvelopeFunction(req, document.docusignEnvId);
          if (result?.documentUrl) {
            await DocusignAuditModel.updateOne({ envId: document.docusignEnvId }, { documentUrl: result.documentUrl, envStatus: result.envStatus }, { upsert: true });
            document.docusignEnvDocumentUrl = result.documentUrl;
            console.log('in if save ')
            await document.save();
            documentsArray.push({
              addedBy: req.user._id,
              title: `[${document.docusignEnvId}] ${document.docusignEmailSubject}`,
              attachment: [{
                name: `[${document.docusignEnvId}] ${document.docusignEmailSubject}`,
                value: result.documentUrl,
                type: "application/pdf"
              }],
              timestamps: new Date().getTime()

            })
          } else {
            document.lastAccessedAt = new Date();
            await document.save();
          }
        }
        else {
          console.log("in else save");
          document.lastAccessedAt = new Date();
          await document.save();
        }
      }
      if (documentsArray.length > 0)
        await CompanyModel.updateOne({ _id: companyId }, { $push: { documents: { $each: documentsArray } } });
      console.log('------------------------------------------------------------------------------------');

      return;
    } catch (error) {
      console.log(error);
    }
  }
  async dropdownListModuleWise(req: Request, res: Response) {
    try {
      if (!req.body.module || req.body.module.length <= 0) {
        return res.send({ success: false, message: "module name required" });
      }

      let limit =
        isNaN(Number(req.body.limit)) == true ? 10 : Number(req.body.limit);
      let skip =
        isNaN(Number(req.body.skip)) == true ? 0 : Number(req.body.skip);
      let filter: any = {};
      let aggregatePipeline = [];
      let data: any = [];
      let isNext = false;

      if (req.body.search) {
        filter.$or = [
          { email: { $regex: `.*${req.body.search}.*`, $options: "i" } },
        ];
      }

      if (req.body.module == "user") {
        aggregatePipeline.push({ $match: filter });
        if (!isNaN(skip)) {
          aggregatePipeline.push({ $skip: skip });
        }
        if (!isNaN(limit)) {
          aggregatePipeline.push({ $limit: limit });
        }
        aggregatePipeline.push({ $project: { email: 1, _id: 0 } });
        data = await UserModel.aggregate(aggregatePipeline);
      } else if (req.body.module == "company") {
        if (!req.body.companyId || req.body.companyId.length <= 0) {
          return res.send({ success: false, message: "companyId required." });
        }
        aggregatePipeline.push({
          $match: { _id: ObjectId(req.body.companyId) },
        });
        aggregatePipeline.push({ $project: { Contact: 1 } });
        aggregatePipeline.push({
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "companyId",
            as: "ContactList",
          },
        });
        aggregatePipeline.push({
          $unwind: {
            path: "$ContactList",
            preserveNullAndEmptyArrays: false,
          },
        });

        aggregatePipeline.push({
          $project: { email: "$ContactList.email", _id: 0 },
        });

        if (req.body.search) {
          filter.$or = [
            { email: { $regex: `.*${req.body.search}.*`, $options: "i" } },
            //   { name: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          ];
          aggregatePipeline.push({ $match: filter });
        }
        if (!isNaN(skip)) {
          aggregatePipeline.push({ $skip: skip });
        }
        if (!isNaN(limit)) {
          aggregatePipeline.push({ $limit: limit });
        }
        data = await CompanyModel.aggregate(aggregatePipeline);
      } else if (req.body.module == "supplier") {
        if (!req.body.supplierId || req.body.supplierId.length <= 0) {
          return res.send({ success: false, message: "supplierId required." });
        }
        aggregatePipeline.push({
          $match: { _id: ObjectId(req.body.supplierId) },
        });
        aggregatePipeline.push({ $project: { "SupplierContact.Email": 1 } });
        aggregatePipeline.push({
          $unwind: {
            path: "$SupplierContact",
            preserveNullAndEmptyArrays: false,
          },
        });
        aggregatePipeline.push({
          $project: {
            _id: 0,
            email: "$SupplierContact.Email",
          },
        });
        if (req.body.search) {
          filter.$or = [
            { email: { $regex: `.*${req.body.search}.*`, $options: "i" } },
          ];
          aggregatePipeline.push({ $match: filter });
        }
        if (!isNaN(skip)) {
          aggregatePipeline.push({ $skip: skip });
        }
        if (!isNaN(limit)) {
          aggregatePipeline.push({ $limit: limit });
        }
        data = await SupplierModel.aggregate(aggregatePipeline);
      } else if (req.body.module === "consumer"){
        filter.role= ObjectId("5d5b92031c9d440000c99915")
        aggregatePipeline.push({ $match: filter });
        if (!isNaN(skip)) {
          aggregatePipeline.push({ $skip: skip });
        }
        if (!isNaN(limit)) {
          aggregatePipeline.push({ $limit: limit });
        }
        aggregatePipeline.push({ $project: { email: 1, _id: 0 } });
        data = await UserModel.aggregate(aggregatePipeline);

      }

      if (data.length === limit) isNext = true;
      else isNext = false;
      res.send({ success: true, isNext: isNext, data: data });
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }
}

export default class AllControllers {
  admin: AdminController;
  constructor() {
    this.admin = new AdminController();
  }
}