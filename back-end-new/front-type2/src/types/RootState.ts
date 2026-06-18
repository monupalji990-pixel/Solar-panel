import { assignee } from "projects/assignee/redux/assignee";
import { AuthStates } from "projects/authentication/redux/auth";
import { company } from "projects/company/redux/company";
import { consumer } from "projects/consumer/redux/consumer";
import { history } from "projects/history/redux/history";
import { lead } from "projects/lead/redux/lead";
import { supplier } from "projects/supplier/redux/supplier";
import { supplier_contact } from "projects/supplier/sections/contact/redux/supplier_contact";
import { userAdmin } from "projects/users/redux/userAdmin";
import { ConfigurationState } from "sharedUtils/sharedRedux/configuration";
import { site } from "projects/site/Redux/site";
import { renewal } from "projects/renewal/Redux/renewal";
import { docusign } from "projects/docusign/redux/docusign";
import { ThemeState } from "styles/theme/types";
import { quote } from "projects/quote/redux/quote";
import { contact } from "projects/contact/redux/contact";
import { task } from "projects/task/redux/task";
import { appointment } from "projects/appointment/redux/appointment";
import { template } from "projects/template/redux/template";
import { digitalDoc } from "projects/digitalDocs/redux/digital";
import { verbalDoc } from "projects/verbalDoc/redux/verbal";
import { ICampaign } from "projects/campaign/redux/campaign";
import { sendinblueContact } from 'projects/sendinblue contacts/redux/sendinblueContact';
import { priceCommission } from 'projects/price_commission/redux/price_commission';
import { payment } from 'projects/payments/redux/payments';
import { record } from 'projects/records/redux/record';
import { itemAdmin } from 'projects/items/redux/itemAdmin'
import { invoiceAdmin } from 'projects/invoice/redux/invoiceAdmin'

export interface RootState {
  theme?: ThemeState;
  auth?: AuthStates;
  configuration?: ConfigurationState;
  userAdmin?: userAdmin;
  history?: history;
  supplier?: supplier;
  supplier_contact?: supplier_contact;
  consumer?: consumer;
  assignee?: assignee;
  lead?: lead;
  company?: company;
  site?: site;
  quote?: quote;
  renewal?: renewal;
  contact?: contact;
  task?: task;
  appointment?: appointment;
  docusign?: docusign;
  template?: template;
  digitalDoc?: digitalDoc;
  verbalDoc?: verbalDoc;
  campaign?: ICampaign;
  sendinblueContact?: sendinblueContact
  priceCommission?: priceCommission
  payment?: payment
  record?: record
  itemAdmin?: itemAdmin
  invoiceAdmin?: invoiceAdmin
}
