import authenticationRoute from '../projects/authentication/routing';
import masterDataRoute from '../projects/user/routing';
import roleRoute from '../projects/role/routing';
import companyRoute from '../projects/company/routing';
import leadRoute from '../projects/lead/routing';
import siteRoute from '../projects/site/routing';
import csvRoute from '../projects/csv/routing';
import quoteRoute from '../projects/quote/routing';
import renewalRoute from '../projects/renewal/routing';
import supplierRoute from '../projects/supplier/routing';
import taskRoute from '../projects/task/routing';
import consumer from '../projects/consumer/routing';
import docusign from "../projects/docusign/routing";
import templateRoute from "../projects/templates/routing";
import digitalDocumentRoute from "../projects/digitalDocument/routing";
import sendinblueRoute from "../projects/sendinblue/routing";
import paymentRoute from "../projects/paymentHistory/routing"
import appoinmentRoute from "../projects/appoinment/routing"
import formRoute from "../projects/form/routing"
import driveRouter from "../projects/drive/routing";
import driveNewRouter from "../projects/driveNew/routing";
import invoiceRouter from "../projects/invoice/routing";

module.exports = function (app: { use: (arg0: string, arg1: typeof authenticationRoute) => void; }) {
app.use('/api', authenticationRoute);
app.use('/api',invoiceRouter)
app.use('/api', masterDataRoute);
app.use('/api',roleRoute);
app.use('/api', companyRoute);
app.use('/api',leadRoute);
app.use('/api', siteRoute);
app.use('/api', csvRoute);
app.use('/api', quoteRoute);
app.use('/api', renewalRoute);
app.use('/api', supplierRoute);
app.use('/api', taskRoute);
app.use('/api', consumer);
app.use('/api',docusign);
app.use('/api',templateRoute);
app.use('/api',digitalDocumentRoute);
app.use('/api',sendinblueRoute);
app.use('/api',paymentRoute)
app.use('/api',appoinmentRoute)
app.use('/api',formRoute)
app.use('/api',driveRouter)
app.use('/api',driveNewRouter)


};
