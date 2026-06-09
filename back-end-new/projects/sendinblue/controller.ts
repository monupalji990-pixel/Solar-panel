const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_APIKEY;

import { Request, Response } from "../../templates/commandInterface";
import UserModal from '../../models/user';
class AdminController {
  async listSenders(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.SendersApi();

      let data = await apiInstance.getSenders();
      res.send({ data, success: true })
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async getAllIpsOfSender(req: Request, res: Response) {
    try {
      if (!req?.body?.senderId)
        throw { message: 'senderId required', success: false }
      let apiInstance = new SibApiV3Sdk.SendersApi();

      let data = await apiInstance.getIpsFromSender(req.body.senderId);
      res.send({ data, success: true });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }
  async createContact(req: Request, res: Response) {
    try {
      if (!req.body?.email)
        throw { message: 'email required' };
      if (!req.body?.listIds)
        throw { message: 'listIds required' };

      let apiInstance = new SibApiV3Sdk.ContactsApi();
      let createContact = new SibApiV3Sdk.CreateContact();
      createContact.email = req.body.email;
      createContact.listIds = req.body.listIds;
      if (req.body?.attributes)
        createContact.attributes = req.body.attributes;
      if (req.body?.unlinkListIds)
        createContact.unlinkListIds = req.body.unlinkListIds;


      let data = await apiInstance.createContact(createContact)
      res.send({ data, success: true, message: 'Contact created successfully' });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }
  async createContactService(contactData: any) {
    try {
      if (!contactData?.email)
        throw { message: 'email required' };
      if (!contactData?.listIds)
        throw { message: 'listIds required' };

      let apiInstance = new SibApiV3Sdk.ContactsApi();
      let createContact = new SibApiV3Sdk.CreateContact();
      createContact.email = contactData.email;
      createContact.listIds = contactData.listIds;
      if (contactData?.attributes)
        createContact.attributes = contactData.attributes;
      if (contactData?.unlinkListIds)
        createContact.unlinkListIds = contactData.unlinkListIds;


      let data = await apiInstance.createContact(createContact)
      return { data, success: true, message: 'Contact created successfully' };
    } catch (error) {
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        if (obj.message === 'Invalid phone number') {
          delete contactData?.attributes?.SMS
          return this.createContactService(contactData)
        } else {

          return obj;
        }
      } else
        return error;
    }
  }

  async deleteContact(req: Request, res: Response) {
    try {
      if (!req.body?.identifier)
        throw { message: "identifier not found" };
      let apiInstance = new SibApiV3Sdk.ContactsApi();

      let data = await apiInstance.deleteContact(req.body.identifier);
      res.send({ data, success: true, message: 'Contact deleted successfully' });

    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async updateContact(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();
      let identifier;
      if (req.body?.identifier)
        identifier = req.body.identifier;

      let updateContact = new SibApiV3Sdk.UpdateContact();
      if (req.body?.attributes)
        updateContact.attributes = req.body.attributes;
      if (req.body?.listIds)
        updateContact.listIds = req.body.listIds;
      if (req.body?.unlinkListIds)
        updateContact.unlinkListIds = req.body.unlinkListIds;

      let data = await apiInstance.updateContact(identifier, updateContact);

      res.send({ data, success: true, message: 'Contact updated successfully' });

    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async updateContactService(identifier, contactData) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();
      let updateContact = new SibApiV3Sdk.UpdateContact();

      if (Object.keys(contactData).length > 0)
        updateContact.attributes = contactData;


      let data = await apiInstance.updateContact(identifier, updateContact);
      return { data, success: true, message: 'Contact updated successfully' };

    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        return obj
      }
      else
        return error
    }
  }

  async getListContactList(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();

      let limit = 10; // Number | Number of documents per page
      let offset = 0; // Number | Index of the first document of the page

      if (req?.query?.limit) limit = req.query.limit;
      if (req?.query?.skip) offset = req.query.skip;
      let data = await apiInstance.getLists({ limit, offset });
      data.success = true;
      res.send({ data });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }
  async getContactListDetails(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();

      if (!req?.body?.listId)
        throw { message: "listId required" };

      let data = await apiInstance.getList(req.body.listId);
      res.send({ data, success: true });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async listContacts(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();
      let opts: any = {};
      if (req?.query?.limit) opts.limit = Number(req.query.limit)
      else opts.limit = 50;
      if (req?.query?.skip) opts.offset = Number(req.query.skip)
      if (req?.query?.listId) {
        let data = await apiInstance.getContactsFromList(req.query.listId, opts)
        data.success = true;
        res.send(data);
      } else {
        let data = await apiInstance.getContacts(opts);
        data.success = true;
        res.send(data);
      }

    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }
  async viewContact(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.ContactsApi();

      if (!req.body?.identifier)
        throw { message: 'identifier required.' }


      let data = await apiInstance.getContactInfo(req.body.identifier);
      let listData = [];
      for (let listId of data.listIds) {
        let listDetails = await apiInstance.getList(listId);
        listData.push({ name: listDetails.name, id: listId })
      }
      data.listData = listData;
      res.send({ data, success: true });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async createCampaign(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      let emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
      if (req.body.sender) {
        emailCampaigns.sender = { name: req.body.sender.name, email: req.body.sender.email }
      }
      if (req.body.name)
        emailCampaigns.name = req.body.name;
      if (req.body.templateId)
        emailCampaigns.templateId = req.body.templateId;
      if (req.body.scheduledAt)
        emailCampaigns.scheduledAt = req.body.scheduledAt;
      if (req.body.subject)
        emailCampaigns.subject = req.body.subject;
      if (req.body.replyTo)
        emailCampaigns.replyTo = req.body.replyTo;
      if (req.body.toField)
        emailCampaigns.toField = req.body.toField;
      if (req.body.recipients)
        emailCampaigns.recipients = req.body.recipients;
      if (req.body.attachmentUrl)
        emailCampaigns.attachmentUrl = req.body.attachmentUrl;
      if (req.query.header)
        emailCampaigns.header = req.query.header;
      if (req.query.footer)
        emailCampaigns.footer = req.query.footer;
      emailCampaigns.inlineImageActivation = false;
      emailCampaigns.mirrorActive = false;
      emailCampaigns.recurring = false;
      emailCampaigns.type = 'classic';

      let data = await apiInstance.createEmailCampaign(emailCampaigns);
      res.send({ data, success: true, message: "Campaign created successfully" });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }


  }
  async listCampaigns(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      let opts: any = {};
      if (req?.query?.limit) opts.limit = Number(req.query.limit)
      else opts.limit = 50;
      if (req?.query?.skip) opts.offset = Number(req.query.skip)

      let data = await apiInstance.getEmailCampaigns(opts)
      data.success = true;
      res.send(data)
    } catch (error) {
      console.log(error)
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async sendCampaign(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      let data = await apiInstance.sendEmailCampaignNow(req.body.id);
      console.log(data);

      res.send({ data, success: true, message: 'Campaign send successfully' });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async viewCampaign(req: Request, res: Response) {
    try {
      if (!req.body?.id || isNaN(req.body?.id))
        throw { message: "id not found" };

      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

      let data = await apiInstance.getEmailCampaign(req.body.id);
      let apiInstanceContact = new SibApiV3Sdk.ContactsApi();


      let listData = [];
      if(data?.recipients?.lists ){
        for (let listId of data?.recipients?.lists) {
          let listDetails = await apiInstanceContact.getList(listId);
          listData.push({ name: listDetails.name, id: listId })
        }
        data.recipients.lists = listData;
      }
     
      res.send(data)
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    try {
      if (!req.body?.id || isNaN(req.body?.id))
        throw { message: "id not found" };

      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      let data = await apiInstance.deleteEmailCampaign(req.body.id);
      res.send({ data, success: true, message: 'Campaign deleted successfully' });
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async updateCampaign(req: Request, res: Response) {
    try {
      if (!req.body?.id || isNaN(req.body?.id))
        throw { message: "id not found" };

      let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

      let emailCampaign = new SibApiV3Sdk.UpdateEmailCampaign();

      if (req.body.name)
        emailCampaign.name = req.body.name;
      if (req.body.templateId)
        emailCampaign.templateId = req.body.templateId;
      if (req.body.scheduledAt)
        emailCampaign.scheduledAt = req.body.scheduledAt;

      if (req.body.subject)
        emailCampaign.subject = req.body.subject;
      if (req.body.replyTo)
        emailCampaign.replyTo = req.body.replyTo;
      if (req.body.toField)
        emailCampaign.toField = req.body.toField;
      if (req.body.recipients)
        emailCampaign.recipients = req.body.recipients;
      if (req.body.attachmentUrl)
        emailCampaign.attachmentUrl = req.body.attachmentUrl;
      if (req.query.header)
        emailCampaign.header = req.query.header;
      if (req.query.footer)
        emailCampaign.footer = req.query.footer;

      let data = await apiInstance.updateEmailCampaign(req.body.id, emailCampaign)
      res.send({ data, success: true, message: "Campaign updated successfully" });
    } catch (error) {
      console.log(error)
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async listTemplates(req: Request, res: Response) {
    try {
      let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      let opts: any = {};
      if (req?.query?.limit) opts.limit = Number(req.query.limit)
      else opts.limit = 50;
      if (req?.query?.skip) opts.offset = Number(req.query.skip)
      opts.templateStatus = true;

      let data = await apiInstance.getSmtpTemplates(opts)
      res.send(data);
    } catch (error) {
      console.log(error);
      if (error?.response?.text) {
        let obj = JSON.parse(error.response.text)
        obj.success = false;
        res.send(obj)
      }
      else
        res.send(error);
    }
  }

  async autoAddContacts(req: Request, res: Response) {
    try {
      let users = await UserModal.find({ companyId: { $exists: true, $ne: null }, createdAt: { $gt: new Date(1634621946141) }, email: /^((?!power).)*$/ }).select('email name mobile').limit(req.body.limit).skip(req.body.skip);
      let count = 0;
      for (let user of users) {
        let obj: any = {};
        obj.attributes = {};
        if (user?.email) {
          obj.email = user.email;
          if (user?.name)
            obj.attributes.FIRSTNAME = user.name;
          if (user?.mobile && req.body.isMobile)
            obj.attributes.SMS = user.mobile;
          obj.listIds = [18];
          let data = await new AdminController().createContactService(obj).catch(e => console.log('error: ', e.response.text));
          if (data?.response?.text) {
            console.log(obj.email, obj.attributes, 'error:', data.response.text);
          } else {
            count++;
            console.log(obj.email, 'result: ', data);
          }
        }
      }
      console.log('Total user added ------------> ', count)
      res.send({ count, 'last_user': users[users.length - 1], limit: req.body.limit, skip: req.body.skip })
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  }
}


export default AdminController;
