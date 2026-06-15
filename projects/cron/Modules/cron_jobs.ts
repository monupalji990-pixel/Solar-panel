
const cron = require('node-cron');
import CRONController from "../controller";
import QuoteModel from '../../../models/Quotes'
import commonUtils from "../../../sharedModules/smallModules/commanUtils";
import ConsumerController from "../../consumer/controller"
import axios from 'axios';

const ConsumerObject = new ConsumerController();


const moment = require('moment')
const CRONObject = new CRONController();

// time below time is based on UK time()

cron.schedule('40 6 * * *', () => {
    CRONObject.CRON_QuoteExpired();
});

cron.schedule('10 7 * * *', () => {
    CRONObject.RenewalExpired();
});

cron.schedule('20 6 * * *', () => {
    CRONObject.TaskDueDateFlagged_1();
});

cron.schedule('40 6 * * *', () => {
    CRONObject.TaskDueDateFlagged_3();
});

cron.schedule('50 6 * * * *', () => {
    CRONObject.TaskReminder();
});

cron.schedule('0 7 * * *', () => {
    CRONObject.DueTaskMoveToNextDay();
});

cron.schedule('0 9 * * *', () => {
    debtServiceEmailReminder()
});

// Handover pack emails (Graph/Outlook) - first cut runs daily.
// cron_jobs.ts lives in projects/cron/Modules, so reach projects/handoverEmail via ../../handoverEmail
const HandoverEmailController = require('../../handoverEmail/controller').default;
const handoverEmailController = new HandoverEmailController();
console.log('handoverEmail cron wired');
cron.schedule('15 9 * * *', async () => {
    try {
        await handoverEmailController.cronSendPendingHandoverEmails();
    } catch (e) {
        console.log('handoverEmail cron failed', e);
    }
});


function getDateDDMMYYY(date){
const yyyy = date.getFullYear();
let mm = date.getMonth() + 1; // Months start at 0!
let dd = date.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formatedDate = yyyy + '-' + mm + '-' + dd;

console.log(formatedDate)
return formatedDate
}

if(process.env.NODE_APP_INSTANCE === '0'){
cron.schedule('0 6 * * *',async () => {
    let today = getDateDDMMYYY(new Date(new Date().setDate(new Date().getDate()-1)));
     let data:any = await  axios.get(`https://edanpowerportallimited.primodialler.com/apis/admin/call_report_export.php?user=EdanADM&pass=EdanADM&query_date=${today}&end_date=${today}&campaign=EdanUK&list_id=69027755&status=SALE&user_group=Edan`)  
        console.log('in primo call')
      console.log(data.data)
      let numSet = new Set();
    //   console.table(data.data['data'] , ['phone_number_dialed','first_name','last_name','address1','address2','city','state','province','postal_code','SaleDate'])
        if(data.data['status'] === 'true'){
            for(const consumer of data.data['data']){
                consumer.surname = consumer.last_name;
                consumer.postcode = consumer.postal_code;
                consumer.mobile = consumer.phone_number;
                consumer.address_1 = consumer.address1;
                if(consumer.address2){
                    consumer.address_2 = consumer.address2 
                }
                consumer.isFromPrimo = true
               if(!numSet.has(consumer.phone_number)) {
                let d = await  ConsumerObject.regUser.CreateConsumerFromWebsite({body:consumer},null)
                console.log(d)
                if(consumer.phone_number){
                 numSet.add(consumer.phone_number)
                }
               }
            }
        }
})
}
async function debtServiceEmailReminder() {
    try {
        let quotes = await QuoteModel.find({ serviceType: 'Debt', 'debtpayments': { $elemMatch: { isEmailSent: false } } })
            .populate({ path: 'Company', select: 'businessName businessType' })
            .populate({ path: 'Consumer', select: 'firstName' })
            .populate({ path: 'Assignee', select: 'email' })
            .select('Company Consumer Assignee debtpayments QuoteID service')

        quotes.forEach(async (quote) => {
            if (quote.debtpayments.length > 0) {
                quote.debtpayments.forEach((payment, index) => {
                    let p_date = moment(payment.paymentDueDate).add(1, 'M').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    console.log('diff: ', p_date.diff(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), 'days'), 'today: ', moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), 'after 1 month', p_date)
                    if (payment?.isEmailSent == false && p_date.diff(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), 'days') == 7) {
                        if (quote.Company && quote?.Assignee?.email) {
                            commonUtils.mail.sendmail(
                                quote.Assignee.email,
                                commonUtils.mail.templates.DebtPaymentReminder,
                                {
                                    company: quote.Company.businessName,
                                    businessType: quote.Company.businessType,
                                    date: moment().format('DD-MM-YYYY'),
                                    quoteId: quote.QuoteID,
                                    amount: payment.amount,
                                    typeOfDebt: quote.service.debt.typeOfDebt
                                }
                            );
                        } else if (quote.Consumer && quote?.Assignee?.email) {
                            commonUtils.mail.sendmail(
                                quote.Assignee.email,
                                commonUtils.mail.templates.DebtPaymentReminder,
                                {
                                    consumer: quote.Consumer.firstName,
                                    date: moment().format('DD-MM-YYYY'),
                                    quoteId: quote.QuoteID,
                                    amount: payment.amount,
                                    typeOfDebt: quote.service.debt.typeOfDebt
                                }
                            );
                        }
                        quote.debtpayments[index].isEmailSent = true
                    }

                });
                if (quote?.Assignee?.email)
                    await quote.save()

            }

        });
    } catch (error) {
        console.log(error)
    }
}
