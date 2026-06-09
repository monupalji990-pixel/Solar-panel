let nodemailer = require('nodemailer');
let Promise = require('bluebird');
const dotenv = require('dotenv');
const moment = require('moment')
dotenv.config({ path: '.env' });

let transporter = nodemailer.createTransport({
  host: 'host37.theukhost.net',
  port: 465,
  auth: {
    user: 'info@edanpower.co.uk',
    pass: 'Success@combine2022'
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

let templates = {
  changepassword: 101,
  QuoteCreated: 102,
  QuoteProvided: 103,
  RevisedQuote: 104,
  AcceptQuoteProvided: 105,
  RejectQuoteProvided: 106,
  DNDQuoteProvidedtomgt: 107,
  DNDQuoteProvidedtointropart: 108,
  InvoiceforQuoteAccepted: 109,
  QuoteRejectedsendrevise: 110,
  RenewalReminder: 111,
  RenewalQuoteCreated: 112,
  ContractExpired: 113,
  DeleteRequesttoadmin: 114,
  DeleteRequesttoadminByManage: 115,
  LeadCreatedByUser: 116,
  LeadDeleteRequestSendByUser: 117,
  DeleteRequestForQuote: 118,
  QuoteInvoiced: 119,
  NewCompanyCreated: 120,
  RenewalProvided: 121,
  RevisedRenewal: 122,
  AcceptRenewalProvided: 123,
  RejectRenewalProvided: 124,
  DNDRenewalProvidedToMgt: 125,
  RenewalInvoiced: 126,
  FlaggedForThirdDay: 127,
  FlaggedForOneDay: 128,
  ReminderMail: 129,
  DNDQuoteProvided: 130,
  PendingSupplierConfirmation: 131,
  RevisedSupplierRate: 132,
  RenewalRevisedSupplierRate: 133,
  DebtPaymentAdded: 134,
  DebtPaymentReminder: 135,
  AppointmentReminder: 136
};

function mailsendMainFunction(email, subject, text) {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.SENDERMAILPASSWORD,
      to: email,
      subject,
      html: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

function changePasswordTemplate(data) {
  return {
    subject: 'Change password successfully', text: `Hello <b>${data.Name}</b>, Your password 
    has been changed successfully <br/>
      <br/><br/><br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function QuoteCreated(data) {
  if (data.CompanyName) {
    return {
      subject: 'Quote Created',
      text: `Hello <b>${data.Name}</b>, Quote has been created 
        successfully <br/> 
        <b>Company Name:</b> ${data.CompanyName} <br/>
        <b>QuoteID</b>:${data.QuoteID}<br/> 
        <b>Date Of Quote Created:</b>${data.QuoteCreatedDate} <br/> 
        <br/><br/><br/>
         **This is auto generated mail please do not reply in this e-mail**`
    };
  } else {
    return {
      subject: 'Quote Created',
      text: `Hello <b>${data.Name}</b>, Quote has been created 
        successfully <br/> 
        <b>Consumer Name:</b> ${data.ConsumerTitle} ${data.ConsumerFirstName} ${data.ConsumerSurName} <br/>
        <b>QuoteID</b>:${data.QuoteID}<br/> 
        <b>Date Of Quote Created:</b>${data.QuoteCreatedDate} <br/> 
        <br/><br/><br/>
         **This is auto generated mail please do not reply in this e-mail**`
    };
  }
}

function QuoteProvided(data) {
  return {
    subject: 'Quote Provided',
    text: `Hello <b>${data.Name}</b>, Quote is provided.<br/>
     <b>Quote ID</b>:${data.QuoteID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/> 
     
        <br/><br/><br/>
     **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RevisedQuote(data) {
  return {
    subject: 'Revised Quote',
    text: `Hello <b>${data.Name}</b>, Your Quote has been revised.
      <b>Quote ID</b>:${data.QuoteID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/>   <br/><br/><br/>
      **This is auto generated mail please do not reply in this e-mail**`
  };
}

function AcceptQuoteProvided(data) {
  return {
    subject: 'Quote provided Accepted',
    text: `Hello <b>${data.Name}</b>,  Quote provided is Accepted <br/>
      <b>Quote ID</b>:${data.QuoteID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 


     **This is auto generated mail please do not reply in this e-mail**`
  };
}

function PendingSupplierConfirmation(data) {
  if (data.QuoteID) {
    return {
      subject: 'Quote provided for pending supplier confirmation',
      text: `Hello <b>${data.Name}</b>, quote provided for pending supplier confirmation <br/>
          <b>Quote ID</b>:${data.QuoteID}<br/>
          <b>Contract Length:</b>${data.ContractLength} <br/> 
          <b>Notes:</b>${data.Notes}<br/> <br/><br/><br/>
    
            **This is auto generated mail please do not reply in this e-mail**`
    };
  } else {
    return {
      subject: 'Renewal provided for pending supplier confirmation',
      text: `Hello <b>${data.Name}</b>, renewal provided for pending supplier confirmation <br/>
          <b>Renewal ID</b>:${data.RenewalID}<br/>
          <b>Contract Length:</b>${data.ContractLength} <br/> 
          <b>Notes:</b>${data.Notes}<br/> <br/><br/><br/>
    
            **This is auto generated mail please do not reply in this e-mail**`
    };
  }

}

function RevisedSupplierRate(data) {
  return {
    subject: 'Revised supplier rates provided',
    text: `Hello <b>${data.Name}</b>, revised supplier rates provided <br/>
      <b>Quote ID</b>:${data.QuoteID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/> <br/><br/><br/>

        **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RenewalRevisedSupplierRate(data) {
  return {
    subject: 'Revised supplier rates provided',
    text: `Hello <b>${data.Name}</b>, revised supplier rates provided <br/>
      <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/> <br/><br/><br/>

        **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RejectQuoteProvided(data) {
  return {
    subject: 'Quote Provided Rejected',
    text: `Hello <b>${data.Name}</b>, Quote provided is Rejected.<br/>
      <b>Quote ID</b>:${data.QuoteID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Notes:</b>${data.Notes}<br/><br/><br/><br/>
      
        **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DNDQuoteProvidedtomgt(data) {
  return {
    subject: 'DND For Quotes',
    text: `Hello <b>${data.Name}</b>, For Provided Quotes it is marked as DND <br/> 
    <b>Quote ID</b>:${data.QuoteID}<br/>
    <b>Notes:</b>${data.Notes}<br/><br/><br/><br/>

    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DNDQuoteProvidedtointropart(data) {
  return {
    subject: 'DND For Quotes',
    text: `Hello <b>${data.Name}</b>, You have Selected DND for <br/> 
    <b>Quote ID</b>:${data.QuoteID}<br/>
    <b>Notes:</b>${data.Notes}<br/><br/><br/><br/>

    We will not take any further action for your quote.

    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function InvoiceforQuoteAccepted(data) {
  return {
    subject: 'Quote Invoice', text: `Hello <b>${data.Name}</b>, Management has uploaded invoice for your ${data.QuoteID} Please check<br/>  
    

    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function QuoteInvoiced(data) {
  return {
    subject: 'Quote Invoice', text: `Hello <b>${data.Name}</b>, Management has uploaded invoice for your ${data.QuoteID} Please check<br/>  
    

    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function QuoteRejectedsendrevise(data) {
  return {
    subject: 'Quote Rejected',
    text: `Hello <b>${data.Name}</b>, Your Rejected Quote has been revised.
    <b>Quote ID</b>:${data.QuoteID}<br/>
    <b>Contract Length:</b>${data.ContractLength} <br/> 
    <b>Expiry Date:</b>${data.ExpiryDate}<br/>
    <b>Amount: </b>${data.Amount} <br/>
    <b>Notes:</b>${data.Notes}<br/>  <br/><br/><br/>
    
    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function RenewalReminder(data) {
  return {
    subject: 'Renewal Reminder',
    text: `Hello <b>${data.Name}</b>, your ${data.CompanyName} having contract is going to expires in next 20 days
    
    <b>Company Name:</b>${data.CompanyName}<br/>
    <b>Quote ID</b>:${data.QuoteID}<br/>
    <b>Expiry Date:</b>${data.ExpiryDate}<br/><br/><br/><br/>
           
    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function RenewalQuoteCreated(data) {
  return {
    subject: 'Renewal Quote Created',
    text: `Hello <b>${data.Name}</b>, Quote has been created 
    successfully <br/> 
    <b>Company Name:</b> ${data.CompanyName} <br/>
    <b>QuoteID</b>:${data.QuoteCreated}<br/> 
    <b>Date Of Revised QuoteCreated:</b>${data.revisedQuoteCreateddate} <br/> 
    <b>Sales Rep Name:</b>${data.IntroducerName}<br/> 
    <b>Customer Notes:</b>${data.CustomerNotes}<br/> <br/><br/><br/>
     
     **This is auto generated mail please do not reply in this e-mail**`
  };
}
function ContractExpired(data) {
  return {
    subject: 'Contract Expired',
    text: `Hello <b>${data.Name}</b>, your ${data.CompanyName} was having contract has expired.
    
    <b>Company Name:</b>${data.CompanyName}<br/>
    <b>Quote ID</b>:${data.QuoteID}<br/>
    <b>Expiry Date:</b>${data.ExpiryDate}<br/>
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}
function DeleteRequesttoadmin(data) {
  return {
    subject: 'Delete Request received',
    text: `Hello <b>${data.Name}</b>, you have received delete request for <b>Company Name:</b>${data.companyName}<br/>
        <b>Company Name:</b>${data.CompanyName}<br/>
        <b>Partner Name </b>${data.partnername} <br/>
        <b>Sales Rep Name:</b>${data.IntroducerName} <br/>
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DeleteREByManagementTemplate(data) {
  return {
    subject: 'Delete Request received', text: `Hello <b>${data.AdminData.name}</b> you have received delete request for <b>${data.userData.role.roleName} Name:</b>${data.userData.name}<br/> 
        <br/>
        <br/>
        <br/>   
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function LeadCreatedByUser(data) {
  return {
    subject: 'New Lead created',
    text: `Hello <b>${data.PartnerName}</b>, new lead is created<br/> 
        <b>Lead ID:</b>${data.LeadID}<br/>
        <b>Company Name:</b>${data.CompanyName}<br/>
        <b>Lead Next Action date:</b>${data.actiondate}<br/>
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function LeadDeleteRequestSendByUser(data) {
  return {
    subject: 'Lead delete request',
    text: `Hello <b>${data.AdminName}</b>, you have received delete request for <b>Lead ID:</b>${data.LeadID}<br/>  
        <b>Lead ID:</b>${data.LeadID}<br/>
        <b>Company Name:</b>${data.CompanyName}<br/>
        <b>Lead Next Action date:</b>${data.actiondate}<br/>
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DeleteRequestForQuote(data) {
  return {
    subject: 'Delete Request received', text: `Hello <b>${data.AdminName}</b> you have received delete request for <b>Quote ID: </b> ${data.QuoteID}</b><br/>
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function NewCompanyCreated(data) {
  return {
    subject: 'New Company Created', text: `Hello <b>${data.AdminName}</b>, New company: ${data.companyName} is created, please assign Management Partner and sales rep to this company
        <br/>
        <br/>
        <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RenewalProvided(data) {
  return {
    subject: 'Renewal Provided',
    text: `Hello <b>${data.Name}</b>, renewal is provided.<br/>
     <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/>
       
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RevisedRenewal(data) {
  return {
    subject: 'Revised Renewal Provided',
    text: `Hello <b>${data.Name}</b>, revised renewal is provided.<br/>
     <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/><br><br>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function AcceptRenewalProvided(data) {
  return {
    subject: 'Renewal Provided Accepted',
    text: `Hello <b>${data.Name}</b>, renewal provided is accepted.<br/>
     <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RejectRenewalProvided(data) {
  return {
    subject: 'Renewal Provided Rejected',
    text: `Hello <b>${data.Name}</b>, renewal provided is rejected.<br/>
     <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/><br><br>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DNDRenewalProvidedToMgt(data) {
  return {
    subject: 'DND for Renewal',
    text: `Hello <b>${data.Name}</b>, For Provided Renewal is marked as DND. <br/>
     <b>Renewal ID</b>:${data.RenewalID}<br/>
      <b>Contract Length:</b>${data.ContractLength} <br/> 
      <b>Expiry Date:</b>${data.ExpiryDate}<br/>
      <b>Amount: </b>${data.Amount} <br/>
      <b>Notes:</b>${data.Notes}<br/><br><br>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function RenewalInvoiced(data) {
  return {
    subject: 'Renewal Invoice', text: `Hello <b>${data.Name}</b>, invoice uploaded for your renewal ${data.RenewalID}, Please check<br/>  
    

    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function FlaggedForThirdDay(data) {
  return {
    subject: 'Flagged Email for third day',
    text: `Hello <b>${data.Name}</b>, flagged this task, Please check<br/>  
        <b>Company</b>: ${data.CompanyName}<br/>
        <b>Task Title</b>: ${data.TaskName}<br/>
        <b>Due Date</b>: ${data.DueDate} <br/> 
        <b>Priority</b>: ${data.Priority}<br/>
        <b>Assignee</b>: ${data.Name}<br/>
        <br/> <br/> <br/>
    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function FlaggedForOneDay(data) {
  return {
    subject: 'Flagged Email for one day',
    text: `Hello <b>${data.Name}</b>, flagged this task, Please check<br/> 
        <b>Company</b>: ${data.CompanyName}<br/>
        <b>Task Title</b>: ${data.TaskName}<br/>
        <b>Due Date</b>: ${data.DueDate} <br/> 
        <b>Priority</b>: ${data.Priority}<br/>
        <b>Assignee</b>: ${data.Name}<br/> 
        <br/> <br/> <br/>

    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function ReminderMail(data) {
  return {
    subject: 'Reminder Mail',
    text: `Hello <b>${data.Name}</b>, This is reminder mail for task created<br/>  
        <b>Title</b>:${data.TaskName}<br/>
      <b>Priority:</b>${data.Priority} <br/> 
      <b>Due Date:</b>${data.DueDate}<br/>
      <br/><br/><br/>

    **This is auto generated mail please do not reply in this e-mail**`
  };
}

function DebtPaymentAdded(data) {
  return {
    subject: `Payment added for Debt service [${data.quoteId}]`,
    text: `<html xmlns="http://www.w3.org/1999/xhtml">

        <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0;">
          <meta name="format-detection" content="telephone=no" />
        
          <style>
            /* Reset styles */
            body {
              margin: 0;
              padding: 0;
              min-width: 100%;
              width: 100% !important;
              height: 100% !important;
            }
        
            body,
            table,
            td,
            div,
            p,
            a {
              -webkit-font-smoothing: antialiased;
              text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              line-height: 100%;
            }
        
            table,
            td {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse !important;
              border-spacing: 0;
            }
        
            img {
              border: 0;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
        
            /* Rounded corners for advanced mail clients only */
            @media all and (min-width: 560px) {
              .container {
                border-radius: 8px;
                -webkit-border-radius: 8px;
                -moz-border-radius: 8px;
                -khtml-border-radius: 8px;
              }
            }
        
            /* Set color for auto links (addresses, dates, etc.) */
            a,
            a:hover {
              color: #127DB3;
            }
        
            .footer a,
            .footer a:hover {
              color: #999999;
            }
            .tabular-Format{
                border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .tabular-Format tr td{
              background-color: #009879;
            color: #ffffff;
            text-align: left;
            }
          </style>
        
          <!-- MESSAGE SUBJECT -->
          <title>Edan Power CRM Poral</title>
        
        </head>
        
        <!-- BODY -->
        
        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
            background-color: #F0F0F0;
            color: #000000;" bgcolor="#F0F0F0" text="#000000">
        
          <!-- SECTION / BACKGROUND -->
          <!-- Set message background color one again -->
          <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 30px 0; padding: 0 0 0 0; width: 100%;" class="background">
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
        
                <!-- WRAPPER / CONTEINER -->
                <!-- Set conteiner background color -->
                <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding-bottom:10px; width: inherit;
            max-width: 560px;" class="container">
        
                  <!-- HEADER -->
                  <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                  <tr>
                    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                    padding-top: 25px;
                    color: #000000;
                    font-family: sans-serif;" class="header">
                      Payment Done - QuoteId: ${data.quoteId}
                    </td>
                  </tr>
        
               
                  <tr>
                    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                    padding-top: 20px;" class="hero">
                      
                      <table class"tabular-Format" border="2" style="border-color:#ffffff; margin-bottom:20px">
                        
                         <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 220px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Company/Consumer name</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 200px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data?.company ? data.company : data.consumer}</td>
                          </tr>

                          ${data?.company ? ` <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 150px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Business Type</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 140px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data?.businessType}</td>
                          </tr> `: ''}
                        
                         <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Date</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data?.date}</td>
                          </tr>
                        
                        <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Quote Id</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data.quoteId}</td>
                          </tr>
                        
                        <tr>
                         <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Amount</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data.amount}</td>
                          </tr>
                          <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
             max-width: 100px; padding:5px 15px; color:#ffffff;">Type of debt</td>
                           <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
             max-width: 200px; padding:5px 15px; color:#000000;">${data.typeOfDebt}</td>
                           </tr>
                      </table>
                    </td>
                  </tr>
        
                  <!-- End of WRAPPER -->
                </table>
        
                <!-- WRAPPER -->
                <!-- Set wrapper width (twice) -->
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
            max-width: 560px;" class="wrapper">
        
                  <tr>
                    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    color: #999999;
                    font-family: sans-serif;" class="footer">
        
                    </td>
                  </tr>
        
                  <!-- End of WRAPPER -->
                </table>
        
                <!-- End of SECTION / BACKGROUND -->
              </td>
            </tr>
          </table>
        
        </body>
        
        </html>`
  }
}

function DebtPaymentReminder(data) {
  return {
    subject: `Debt service reminder [${data.quoteId}]`,
    text: `<html xmlns="http://www.w3.org/1999/xhtml">

        <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0;">
          <meta name="format-detection" content="telephone=no" />
        
          <style>
            /* Reset styles */
            body {
              margin: 0;
              padding: 0;
              min-width: 100%;
              width: 100% !important;
              height: 100% !important;
            }
        
            body,
            table,
            td,
            div,
            p,
            a {
              -webkit-font-smoothing: antialiased;
              text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              line-height: 100%;
            }
        
            table,
            td {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse !important;
              border-spacing: 0;
            }
        
            img {
              border: 0;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
        
            /* Rounded corners for advanced mail clients only */
            @media all and (min-width: 560px) {
              .container {
                border-radius: 8px;
                -webkit-border-radius: 8px;
                -moz-border-radius: 8px;
                -khtml-border-radius: 8px;
              }
            }
        
            /* Set color for auto links (addresses, dates, etc.) */
            a,
            a:hover {
              color: #127DB3;
            }
        
            .footer a,
            .footer a:hover {
              color: #999999;
            }
            .tabular-Format{
                border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .tabular-Format tr td{
              background-color: #009879;
            color: #ffffff;
            text-align: left;
            }
          </style>
        
          <!-- MESSAGE SUBJECT -->
          <title>Edan Power CRM Poral</title>
        
        </head>
        
        <!-- BODY -->
        
        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
            background-color: #F0F0F0;
            color: #000000;" bgcolor="#F0F0F0" text="#000000">
        
          <!-- SECTION / BACKGROUND -->
          <!-- Set message background color one again -->
          <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 30px 0; padding: 0 0 0 0; width: 100%;" class="background">
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
        
                <!-- WRAPPER / CONTEINER -->
                <!-- Set conteiner background color -->
                <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding-bottom:10px; width: inherit;
            max-width: 560px;" class="container">
        
                  <!-- HEADER -->
                  <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                  <tr>
                  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 14px; font-weight: normal; line-height: 130%;
                  padding-top: 5px;
                  color: #000000;
                  font-family: sans-serif;" class="header">
                   Next payment is due in 7 days for Debt Support. Can you please make sure pay your balance by the due date. Your remaining balance after the payment is 
                  </td>
                </tr>
               
                  <tr>
                    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                    padding-top: 20px;" class="hero">
                      
                      <table class"tabular-Format" border="2" style="border-color:#ffffff; margin-bottom:20px">
                        
                         <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 220px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Company/Consumer name</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 200px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data?.company ? data.company : data.consumer}</td>
                          </tr>

                          ${data?.company ? ` <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 150px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Business Type</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 140px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data?.businessType}</td>
                          </tr> `: ''}
                        
                        <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
            max-width: 100px; padding:5px 15px; color:#ffffff;">Quote Id</td>
                          <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
            max-width: 200px; padding:5px 15px; color:#000000;">${data.quoteId}</td>
                          </tr>
                          <tr>
                          <td style="font-family: sans-serif; background:#009edb;    min-width: 70px;
             max-width: 100px; padding:5px 15px; color:#ffffff;">Type of debt</td>
                           <td style="font-family: sans-serif; background:#8edfff;    min-width: 130px;
             max-width: 200px; padding:5px 15px; color:#000000;">${data.typeOfDebt}</td>
                           </tr>
                      </table>
                    </td>
                  </tr>
        
                  <!-- End of WRAPPER -->
                </table>
        
                <!-- WRAPPER -->
                <!-- Set wrapper width (twice) -->
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
            max-width: 560px;" class="wrapper">
        
                  <tr>
                    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    color: #999999;
                    font-family: sans-serif;" class="footer">
        
                    </td>
                  </tr>
        
                  <!-- End of WRAPPER -->
                </table>
        
                <!-- End of SECTION / BACKGROUND -->
              </td>
            </tr>
          </table>
        
        </body>
        
        </html>`
  }
}

function SurveryForEmailTemplate(data, address, postcode, booker, type) {

  var today = new Date()
  var curHr = today.getHours()
  var greetingText = 'Good Morning'
  let comOrCus = null

  if (data?.Consumer) {
    comOrCus = 'cus'
  } else if (data?.Company) {
    comOrCus = 'com'
  }

  if (curHr < 12) {
    greetingText = 'Good Morning'
  } else if (curHr < 18) {
    greetingText = 'Good Afternoon'
  } else {
    greetingText = 'Good Evening'
  }

  const DateWithTimezone = (data) => {
    const date = new Date(data.startTime);
    const options: any = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Europe/London',
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formatter;
  }

  return {
    subject: (data?.update ? '[Updated]' : '') + `Solar Appointment Confirmation`,
    text: `
    <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">

          <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet"
              type="text/css">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
              type="text/css">

          <style>
              @media only screen and (min-width: 620px) {
                  .u-row .u-col {
                      vertical-align: top;
                  }
              }

              @media (max-width: 620px) {
                .logos_size {
                  width: 100% !important;
              }
                  body{
                    padding: 5px !important;
                  }
                  .mobile-address tr td {
                      display: block !important;
                  }
      
                  .mobile-solo tr td {
                      /* display: block !important; */
                  }
      
                  .mobile-solo tr td img {
                      width: 100% !important;
                      height: auto !important;
                  }
      
                  .mobile-size {
                      display: block !important;
                  }
                  .u-row-container {
                      max-width: 100% !important;
                      padding-left: 0px !important;
                      padding-right: 0px !important;
                  }

                  .u-row .u-col {
                      min-width: 320px !important;
                      max-width: 100% !important;
                      display: block !important;
                  }

                  .u-row {
                      width: calc(100% - 40px) !important;
                  }

                  .u-col {
                      width: 100% !important;
                  }

                  .u-col>div {
                      margin: 0 auto;
                  }

                  .mailer_detail .left_logo {
                      float: none !important;
                      width: 100% !important;
                      height: auto !important;
                      padding: 1rem !important;
                  }

                  .mailer_detail .left_logo img {
                      width: 70% !important;
                  }

                  .divider {
                      display: none !important;
                  }

                  .mailer_detail .right_content {
                      padding: 0 1rem;
                  }
              }

              .logos_size {
                max-width: 85%;
                width: 85%;
                
            }
    
              body {
                  margin: 0;
                  padding: 0;
              }

              table,
              tr,
              td {
                  vertical-align: top;
                  border-collapse: collapse;
              }

              .ie-container table,
              .mso-container table {
                  table-layout: fixed;
              }

              * {
                  line-height: inherit;
              }

              a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
              }

              table,
              td {
                  color: #000000;
              }

              .bold_text {
                  font-weight: bold;
              }

              .blue_text {
                  font-weight: bold;
                  color: #00a8ec;
              }
              .mailer_detail .left_logo {
                  float: left;
                  height: 90px;
                  padding: 5rem 1rem;
                  margin: 0 auto;
                  text-align: center;
              }
              .mailer_detail .left_logo img {
                  max-width: 200px;
              }
              .mail_content {
                  clear: both;
                  margin-top: 3rem;
              }
              .divider {
                  width: 3px;
                  background: #00a8ec;
                  height: 160px;
                  display: block;
                  float: left;
                  margin-right: 1rem;
              }
              .mail_content p {
                  font-style: italic;
              }

              .mail_logos {
                clear: both;
            }
    
            .mail_logos div img {
                float: left;
                max-height: 70px;
                object-fit: cover;
                padding: 6px;
            }
            .mail_logos div{
                margin: 10px 0;
                display: inline-block;
            }
            .mobile-address tr td p{
              margin-bottom: 0 !important;
              margin-top: 5px !important;
              font-size: 14px;
          }
          .logos_div {
            text-align: left;
        }
        .content-size p{
          font-size: 14px;
      }
          </style>
      </head>

      <body class="clean-body u_body"
          style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
          <table id="u_body"
              style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
              cellpadding="0" cellspacing="0">
              <tbody>
                  <tr style="vertical-align: top">
                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                          <div class="u-row-container" style="padding: 0px;">
                              <div class="u-row"
                                  style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                  <div class="mobile-size"
                                      style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                      <div class="u-col u-col-100"
                                          style="max-width: 320px;display: table-cell;vertical-align: top;">
                                          <div style="height: 100%;width: 100% !important;">
                                              <div
                                                  style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                  <div>
                                                      <p>${greetingText},</p>

                                                      <p class="bold_text">Re: ${address}, ${postcode}</p>
                                                      <p>It was great speaking to you earlier. To confirm, the solar surveyor
                                                          has
                                                          been
                                                          scheduled at
                                                          <span class="bold_text">
                                                          ${DateWithTimezone(data)}
                                                          </span>
                                                      </p>
                                                      <p>We provide sustainable designs and our talented crew who are
                                                          specialist
                                                          experienced
                                                          installers. As
                                                          you may be aware, the government aims to cut carbon dioxide
                                                          emissions by
                                                          some
                                                          80% by 2050,
                                                          whilst maintaining reliable and competitive energy supplies. In
                                                          order to
                                                          achieve
                                                          these
                                                          targets a great
                                                          emphasis is being placed on the increased development of renewable
                                                          energy
                                                          resources, such as
                                                          solar power.</p>

                                                      <p>If you have any questions or concerns, please do not hesitate to get
                                                          in
                                                          touch
                                                          with me by
                                                          replying to
                                                          this email or via the contact details below.</p>

                                                      <p>Kind Regards,</p>

                                                      <table class="mobile-address">
                                                    <tr>
                                                        <td style="vertical-align: middle; padding-right: 20px;">
                                                            <img width="200" height="81" align="center" alt="Logo"
                                                                style="width: 200px; max-width: 200px; height: 81px; max-height: 81px;"
                                                                src="https://edan-power.s3.amazonaws.com/EP+Email+Logos/EDANPOWER.png"
                                                                alt="edan power" />
                                                        </td>
                                                        <td>
                                                            <p class="divider"></p>
                                                        </td>
                                                        <td>
                                                            <p class="blue_text">${booker.name}</p>
                                                            <p class="bold_text">Edanpower</p>
                                                            <p><span class="blue_text">T:</span> 0121 399 0023</p>
                                                            <p><span class="blue_text">Office Mobile:</span> 07399
                                                                120284
                                                            </p>
                                                            <p><span class="blue_text">W:</span> <a
                                                                    href="https://www.edanpower.co.uk/"
                                                                    target="_blank">https://www.edanpower.co.uk/</a></p>
                                                            <p><span class="blue_text">E:</span> <a href="mailto:${booker.email}"
                                                                    target="_blank">${booker.email}</a>
                                                            </p>
                                                            <p><span class="blue_text">A:</span> Leslie Square, Office
                                                                24
                                                                Block
                                                                C, Paper
                                                                Mill End,
                                                                Birmingham,
                                                                B44
                                                                8NH</p>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table id="u_body"
        style="border-collapse: collapse;margin-top:30px;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                    <div class="u-row-container" style="padding: 0px;">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div class="mobile-size"
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">
                                        <div
                                            style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                <table align="left" class="desktop-solo"
                                                  style="text-align: left; vertical-align: middle;">
                                                      <tr>
                                                          <td style="vertical-align: baseline;">
                                                              <img class="logos_size"
                                                              width="85%"
                                                                  src="https://edan-power.s3.amazonaws.com/dbvz3h5695690l2c6v-1671121609170.png"
                                                                  alt="Mail Logos" />
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
              
                              </td>
                          </tr>
                      </tbody>
                  </table>
                                                      <div class="mail_content">
                                                          <p>The content of this email is confidential and intended for the
                                                              recipient
                                                              specified in
                                                              message only.
                                                              It is
                                                              strictly
                                                              forbidden to share any part of this message with any third
                                                              party,
                                                              without a
                                                              written
                                                              consent of the
                                                              sender. If you
                                                              received this message by mistake, please reply to this message
                                                              and
                                                              follow
                                                              with its
                                                              deletion, so that
                                                              we
                                                              can
                                                              ensure such a mistake does not occur in the future.
                                                          </p>
                                                      </div>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </td>
                  </tr>
              </tbody>
          </table>
      </body>

      </html>
    `,
    whatsappText: `**Solar Appointment Confirmation**: This is a reminder for ${type}'s appointment at **${new Date(data.startTime).toLocaleString('en-GB', { timeZone: 'Europe/London', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      }** between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.`
  }
}

function ScaffoldingForEmailTemplate(data, booker) {
  var today = new Date()
  var curHr = today.getHours()
  var greetingText = 'Good Morning'
  let comOrCus = null
  let address = ''

  if (data?.Consumer) {
    comOrCus = 'cus'
  } else if (data?.Company) {
    comOrCus = 'com'
  }

  if (data?.Consumer?.addressOne) {
    address += data.Consumer.addressOne
  }
  if (data?.Consumer?.addressTwo) {
    address += ', ' + data.Consumer.addressTwo
  }
  if (data?.Company?.firstLine) {
    address += data.Company.firstLine
  }
  if (data?.Company?.secondLine) {
    address += ', ' + data.Company.secondLine
  }


  if (curHr < 12) {
    greetingText = 'Good Morning'
  } else if (curHr < 18) {
    greetingText = 'Good Afternoon'
  } else {
    greetingText = 'Good Evening'
  }

  const DateWithTimezone = (data) => {
    const date = new Date(data.startTime);
    const options: any = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Europe/London',
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formatter;
  }

  return {
    subject: (data?.update ? '[Updated]' : '') + `Solar Appointment Confirmation`,
    text: `
    <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">

          <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet"
              type="text/css">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
              type="text/css">

          <style>
              @media only screen and (min-width: 620px) {
                  .u-row .u-col {
                      vertical-align: top;
                  }
              }

              @media (max-width: 620px) {
                .logos_size {
                  width: 100% !important;
              }
                  body{
                    padding: 5px !important;
                  }
                  .mobile-address tr td {
                      display: block !important;
                  }
      
                  .mobile-solo tr td {
                      /* display: block !important; */
                  }
      
                  .mobile-solo tr td img {
                      width: 100% !important;
                      height: auto !important;
                  }
      
                  .mobile-size {
                      display: block !important;
                  }
                  .u-row-container {
                      max-width: 100% !important;
                      padding-left: 0px !important;
                      padding-right: 0px !important;
                  }

                  .u-row .u-col {
                      min-width: 320px !important;
                      max-width: 100% !important;
                      display: block !important;
                  }

                  .u-row {
                      width: calc(100% - 40px) !important;
                  }

                  .u-col {
                      width: 100% !important;
                  }

                  .u-col>div {
                      margin: 0 auto;
                  }

                  .mailer_detail .left_logo {
                      float: none !important;
                      width: 100% !important;
                      height: auto !important;
                      padding: 1rem !important;
                  }

                  .mailer_detail .left_logo img {
                      width: 70% !important;
                  }

                  .divider {
                      display: none !important;
                  }

                  .mailer_detail .right_content {
                      padding: 0 1rem;
                  }
              }

              .logos_size {
                max-width: 85%;
                width: 85%;
                
            }
    
              body {
                  margin: 0;
                  padding: 0;
              }

              table,
              tr,
              td {
                  vertical-align: top;
                  border-collapse: collapse;
              }

              .ie-container table,
              .mso-container table {
                  table-layout: fixed;
              }

              * {
                  line-height: inherit;
              }

              a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
              }

              table,
              td {
                  color: #000000;
              }

              .bold_text {
                  font-weight: bold;
              }

              .blue_text {
                  font-weight: bold;
                  color: #00a8ec;
              }
              .mailer_detail .left_logo {
                  float: left;
                  height: 90px;
                  padding: 5rem 1rem;
                  margin: 0 auto;
                  text-align: center;
              }
              .mailer_detail .left_logo img {
                  max-width: 200px;
              }
              .mail_content {
                  clear: both;
                  margin-top: 3rem;
              }
              .divider {
                  width: 3px;
                  background: #00a8ec;
                  height: 160px;
                  display: block;
                  float: left;
                  margin-right: 1rem;
              }
              .mail_content p {
                  font-style: italic;
              }

              .mail_logos {
                clear: both;
            }
    
            .mail_logos div img {
                float: left;
                max-height: 70px;
                object-fit: cover;
                padding: 6px;
            }
            .mail_logos div{
                margin: 10px 0;
                display: inline-block;
            }
            .mobile-address tr td p{
              margin-bottom: 0 !important;
              margin-top: 5px !important;
              font-size: 14px;
          }
          .logos_div {
            text-align: left;
        }
        .content-size p{
          font-size: 14px;
      }
          </style>
      </head>

      <body class="clean-body u_body"
          style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
          <table id="u_body"
              style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
              cellpadding="0" cellspacing="0">
              <tbody>
                  <tr style="vertical-align: top">
                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                          <div class="u-row-container" style="padding: 0px;">
                              <div class="u-row"
                                  style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                  <div class="mobile-size"
                                      style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                      <div class="u-col u-col-100"
                                          style="max-width: 320px;display: table-cell;vertical-align: top;">
                                          <div style="height: 100%;width: 100% !important;">
                                              <div
                                                  style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                  <div>
                                                      <p>${greetingText},</p>

                                                      <p>This is just quick email to confirm we have arranged scaffolding for your property on ${DateWithTimezone(data)}. Please make
                                                      sure someone is available at the property on that time. If you are unable to keep that date please email us
                                                      or call us in office as soon as possible. 
                                                      </p>
                                                     
                                                      <p>Kind Regards,</p>

                                                      <table class="mobile-address">
                                                    <tr>
                                                        <td style="vertical-align: middle; padding-right: 20px;">
                                                            <img width="200" height="81" align="center" alt="Logo"
                                                                style="width: 200px; max-width: 200px; height: 81px; max-height: 81px;"
                                                                src="https://edan-power.s3.amazonaws.com/EP+Email+Logos/EDANPOWER.png"
                                                                alt="edan power" />
                                                        </td>
                                                        <td>
                                                            <p class="divider"></p>
                                                        </td>
                                                        <td>
                                                            <p class="blue_text">${booker.name}</p>
                                                            <p class="bold_text">Edanpower</p>
                                                            <p><span class="blue_text">T:</span> 0121 399 0023</p>
                                                            <p><span class="blue_text">Office Mobile:</span> 07399
                                                                120284
                                                            </p>
                                                            <p><span class="blue_text">W:</span> <a
                                                                    href="https://www.edanpower.co.uk/"
                                                                    target="_blank">https://www.edanpower.co.uk/</a></p>
                                                            <p><span class="blue_text">E:</span> <a href="mailto:${booker.email}"
                                                                    target="_blank">${booker.email}</a>
                                                            </p>
                                                            <p><span class="blue_text">A:</span> Leslie Square, Office
                                                                24
                                                                Block
                                                                C, Paper
                                                                Mill End,
                                                                Birmingham,
                                                                B44
                                                                8NH</p>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table id="u_body"
        style="border-collapse: collapse;margin-top:30px;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                    <div class="u-row-container" style="padding: 0px;">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div class="mobile-size"
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">
                                        <div
                                            style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                <table align="left" class="desktop-solo"
                                                  style="text-align: left; vertical-align: middle;">
                                                      <tr>
                                                          <td style="vertical-align: baseline;">
                                                              <img class="logos_size"
                                                              width="85%"
                                                                  src="https://edan-power.s3.amazonaws.com/dbvz3h5695690l2c6v-1671121609170.png"
                                                                  alt="Mail Logos" />
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
              
                              </td>
                          </tr>
                      </tbody>
                  </table>
                                                      <div class="mail_content">
                                                          <p>The content of this email is confidential and intended for the
                                                              recipient
                                                              specified in
                                                              message only.
                                                              It is
                                                              strictly
                                                              forbidden to share any part of this message with any third
                                                              party,
                                                              without a
                                                              written
                                                              consent of the
                                                              sender. If you
                                                              received this message by mistake, please reply to this message
                                                              and
                                                              follow
                                                              with its
                                                              deletion, so that
                                                              we
                                                              can
                                                              ensure such a mistake does not occur in the future.
                                                          </p>
                                                      </div>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </td>
                  </tr>
              </tbody>
          </table>
      </body>

      </html>
    `,
    whatsappText: `**Solar Appointment Confirmation**: This is a reminder for Scaffolding's appointment at **${new Date(data.startTime).toLocaleString('en-GB', { timeZone: 'Europe/London', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      }** between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.`
  }
}

function InstallationForEmailTemplate(data, booker) {
  var today = new Date()
  var curHr = today.getHours()
  var greetingText = 'Good Morning'
  let comOrCus = null
  let address = ''

  if (data?.Consumer) {
    comOrCus = 'cus'
  } else if (data?.Company) {
    comOrCus = 'com'
  }
  if (curHr < 12) {
    greetingText = 'Good Morning'
  } else if (curHr < 18) {
    greetingText = 'Good Afternoon'
  } else {
    greetingText = 'Good Evening'
  }

  if (data?.Consumer?.addressOne) {
    address += data.Consumer.addressOne
  }
  if (data?.Consumer?.addressTwo) {
    address += ', ' + data.Consumer.addressTwo
  }
  if (data?.Company?.firstLine) {
    address += data.Company.firstLine
  }
  if (data?.Company?.secondLine) {
    address += ', ' + data.Company.secondLine
  }

  const DateWithTimezone = (data) => {
    const date = new Date(data.startTime);
    const options: any = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Europe/London',
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formatter;
  }

  return {
    subject: (data?.update ? '[Updated]' : '') + `Solar Appointment Confirmation`,
    text: `
    <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">

          <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet"
              type="text/css">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
              type="text/css">

          <style>
              @media only screen and (min-width: 620px) {
                  .u-row .u-col {
                      vertical-align: top;
                  }
              }

              @media (max-width: 620px) {
                .logos_size {
                  width: 100% !important;
              }
                  body{
                    padding: 5px !important;
                  }
                  .mobile-address tr td {
                      display: block !important;
                  }
      
                  .mobile-solo tr td {
                      /* display: block !important; */
                  }
      
                  .mobile-solo tr td img {
                      width: 100% !important;
                      height: auto !important;
                  }
      
                  .mobile-size {
                      display: block !important;
                  }
                  .u-row-container {
                      max-width: 100% !important;
                      padding-left: 0px !important;
                      padding-right: 0px !important;
                  }

                  .u-row .u-col {
                      min-width: 320px !important;
                      max-width: 100% !important;
                      display: block !important;
                  }

                  .u-row {
                      width: calc(100% - 40px) !important;
                  }

                  .u-col {
                      width: 100% !important;
                  }

                  .u-col>div {
                      margin: 0 auto;
                  }

                  .mailer_detail .left_logo {
                      float: none !important;
                      width: 100% !important;
                      height: auto !important;
                      padding: 1rem !important;
                  }

                  .mailer_detail .left_logo img {
                      width: 70% !important;
                  }

                  .divider {
                      display: none !important;
                  }

                  .mailer_detail .right_content {
                      padding: 0 1rem;
                  }
              }

              .logos_size {
                max-width: 85%;
                width: 85%;
                
            }
    
              body {
                  margin: 0;
                  padding: 0;
              }

              table,
              tr,
              td {
                  vertical-align: top;
                  border-collapse: collapse;
              }

              .ie-container table,
              .mso-container table {
                  table-layout: fixed;
              }

              * {
                  line-height: inherit;
              }

              a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
              }

              table,
              td {
                  color: #000000;
              }

              .bold_text {
                  font-weight: bold;
              }

              .blue_text {
                  font-weight: bold;
                  color: #00a8ec;
              }
              .mailer_detail .left_logo {
                  float: left;
                  height: 90px;
                  padding: 5rem 1rem;
                  margin: 0 auto;
                  text-align: center;
              }
              .mailer_detail .left_logo img {
                  max-width: 200px;
              }
              .mail_content {
                  clear: both;
                  margin-top: 3rem;
              }
              .divider {
                  width: 3px;
                  background: #00a8ec;
                  height: 160px;
                  display: block;
                  float: left;
                  margin-right: 1rem;
              }
              .mail_content p {
                  font-style: italic;
              }

              .mail_logos {
                clear: both;
            }
    
            .mail_logos div img {
                float: left;
                max-height: 70px;
                object-fit: cover;
                padding: 6px;
            }
            .mail_logos div{
                margin: 10px 0;
                display: inline-block;
            }
            .mobile-address tr td p{
              margin-bottom: 0 !important;
              margin-top: 5px !important;
              font-size: 14px;
          }
          .logos_div {
            text-align: left;
        }
        .content-size p{
          font-size: 14px;
      }
          </style>
      </head>

      <body class="clean-body u_body"
          style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
          <table id="u_body"
              style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%"
              cellpadding="0" cellspacing="0">
              <tbody>
                  <tr style="vertical-align: top">
                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                          <div class="u-row-container" style="padding: 0px;">
                              <div class="u-row"
                                  style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                  <div class="mobile-size"
                                      style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                      <div class="u-col u-col-100"
                                          style="max-width: 320px;display: table-cell;vertical-align: top;">
                                          <div style="height: 100%;width: 100% !important;">
                                              <div
                                                  style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                  <div>
                                                      <p>${greetingText},</p>

                                                      <p>This is just quick email to confirm we have arranged Installation for your property on ${DateWithTimezone(data)}. Please make
                                                      sure someone is available at the property on that date. If you are unable to keep that date please email us
                                                      or call us in office as soon as possible.
                                                      </p>
                                                     
                                                      <p>Kind Regards,</p>

                                                      <table class="mobile-address">
                                                    <tr>
                                                        <td style="vertical-align: middle; padding-right: 20px;">
                                                            <img width="200" height="81" align="center" alt="Logo"
                                                                style="width: 200px; max-width: 200px; height: 81px; max-height: 81px;"
                                                                src="https://edan-power.s3.amazonaws.com/EP+Email+Logos/EDANPOWER.png"
                                                                alt="edan power" />
                                                        </td>
                                                        <td>
                                                            <p class="divider"></p>
                                                        </td>
                                                        <td>
                                                            <p class="blue_text">${booker.name}</p>
                                                            <p class="bold_text">Edanpower</p>
                                                            <p><span class="blue_text">T:</span> 0121 399 0023</p>
                                                            <p><span class="blue_text">Office Mobile:</span> 07399
                                                                120284
                                                            </p>
                                                            <p><span class="blue_text">W:</span> <a
                                                                    href="https://www.edanpower.co.uk/"
                                                                    target="_blank">https://www.edanpower.co.uk/</a></p>
                                                            <p><span class="blue_text">E:</span> <a href="mailto:${booker.email}"
                                                                    target="_blank">${booker.email}</a>
                                                            </p>
                                                            <p><span class="blue_text">A:</span> Leslie Square, Office
                                                                24
                                                                Block
                                                                C, Paper
                                                                Mill End,
                                                                Birmingham,
                                                                B44
                                                                8NH</p>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table id="u_body"
        style="border-collapse: collapse;margin-top:30px;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;background-color: #ffffff;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

                    <div class="u-row-container" style="padding: 0px;">
                        <div class="u-row"
                            style="Margin: 0 auto;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div class="mobile-size"
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;display: table-cell;vertical-align: top;">
                                    <div style="height: 100%;width: 100% !important;">
                                        <div
                                            style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                <table align="left" class="desktop-solo"
                                                  style="text-align: left; vertical-align: middle;">
                                                      <tr>
                                                          <td style="vertical-align: baseline;">
                                                              <img class="logos_size"
                                                              width="85%"
                                                                  src="https://edan-power.s3.amazonaws.com/dbvz3h5695690l2c6v-1671121609170.png"
                                                                  alt="Mail Logos" />
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
              
                              </td>
                          </tr>
                      </tbody>
                  </table>
                                                      <div class="mail_content">
                                                          <p>The content of this email is confidential and intended for the
                                                              recipient
                                                              specified in
                                                              message only.
                                                              It is
                                                              strictly
                                                              forbidden to share any part of this message with any third
                                                              party,
                                                              without a
                                                              written
                                                              consent of the
                                                              sender. If you
                                                              received this message by mistake, please reply to this message
                                                              and
                                                              follow
                                                              with its
                                                              deletion, so that
                                                              we
                                                              can
                                                              ensure such a mistake does not occur in the future.
                                                          </p>
                                                      </div>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </td>
                  </tr>
              </tbody>
          </table>
      </body>

      </html>
    `,
    whatsappText: `**Solar Appointment Confirmation**: This is a reminder for Installation's appointment at **${new Date(data.startTime).toLocaleString('en-GB', { timeZone: 'Europe/London', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      }** between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.`
  }
}

const AppointmentStatus = {
  1: 'Booked',
  2: 'Finished',
  3: 'Schedule',
  4: 'Surveyor',
  5: 'Follow Up',
  6: 'Revisit',
  7: 'Scaffolding',
  8: 'Installation',
}

function AppoinmentReminder(data) {
  let address = ''
  let postcode = ''
  let type = ''
  let comOrCus = null;
  let booker = data.Booker;
  let service = data.service[0]
  let allService = ['Energy', 'Solar', 'Eco', 'Business Rates'].includes(data.service[0])

  if (data.status) {
    type = AppointmentStatus[data.status]
  }
  if (data.installerFor) {
    type = 'Installation'
  }

  if (data?.Consumer) {
    comOrCus = 'cus'
  } else if (data?.Company) {
    comOrCus = 'com'
  }

  if (data?.Consumer) {
    postcode = data?.Consumer?.postcode
  }
  if (data?.Company) {
    postcode = data?.Company?.postcode
  }

  if (data?.Consumer?.addressOne) {
    address += data.Consumer.addressOne
  }
  if (data?.Consumer?.addressTwo) {
    address += ', ' + data.Consumer.addressTwo
  }
  if (data?.Company?.firstLine) {
    address += data.Company.firstLine
  }
  if (data?.Company?.secondLine) {
    address += ', ' + data.Company.secondLine
  }

  if ((['Surveyor', 'Revisit', 'Schedule'].includes(type)) && service == 'Solar') {
    return SurveryForEmailTemplate(data, address, postcode, booker, type)
  } else if (type == 'Scaffolding') {
    return ScaffoldingForEmailTemplate(data, booker)
  } else if (type == 'Installation') {
    return InstallationForEmailTemplate(data, booker)
  } else {
    return {
      subject: (data?.update ? '[Updated]' : '') + `Solar Appointment Confirmation`,
      text: `Hello,<br/>
        This is a reminder for ${type}'s appointment between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.<br/>
        Sincerely,<br/>
        Team Edan Power<br/>
        This is a system-generated e-mail. Please do not change the subject until required.`,
      whatsappText: `**Solar Appointment Confirmation**: This is a reminder for ${type}'s appointment at **${new Date(data.startTime).toLocaleString('en-GB', { timeZone: 'Europe/London', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
        }** between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.`
    }
  }

  // return {
  //   subject: `Appoinment reminder`,
  //   text: `Hello,<br/>
  //     This is a reminder for ${type}'s appointment between Edan Power's Team Member ${data.Assignee.name} and ${comOrCus == 'cus' ? data.Consumer.firstName : data?.Company?.businessName} residing at ${address}.<br/>
  //     Sincerely,<br/>
  //     Team Edan Power<br/>
  //     This is a system-generated e-mail. Please do not change the subject until required.`
  // }
}

const sendmail = (email, templateType, data) => new Promise((resolve, reject) => {
  let d = {
    subject: 'not found mail for this category',
    text: `not found mail for this category${email}${templateType}`
  };
  switch (templateType) {
    case templates.DeleteRequesttoadminByManage:
      d = DeleteREByManagementTemplate(data);
      break;
    case templates.changepassword:
      d = changePasswordTemplate(data);
      break;
    case templates.QuoteCreated:
      d = QuoteCreated(data);
      break;
    case templates.QuoteProvided:
      d = QuoteProvided(data);
      break;
    case templates.RevisedQuote:
      d = RevisedQuote(data);
      break;
    case templates.AcceptQuoteProvided:
      d = AcceptQuoteProvided(data);
      break;
    case templates.RejectQuoteProvided:
      d = RejectQuoteProvided(data);
      break;
    case templates.DNDQuoteProvidedtomgt:
      d = DNDQuoteProvidedtomgt(data);
      break;
    case templates.DNDQuoteProvided:
      d = DNDQuoteProvidedtointropart(data);
      break;
    case templates.InvoiceforQuoteAccepted:
      d = InvoiceforQuoteAccepted(data);
      break;
    case templates.QuoteInvoiced:
      d = QuoteInvoiced(data);
      break;
    case templates.QuoteRejectedsendrevise:
      d = QuoteRejectedsendrevise(data);
      break;
    case templates.RenewalReminder:
      d = RenewalReminder(data);
      break;
    case templates.RenewalQuoteCreated:
      d = RenewalQuoteCreated(data);
      break;
    case templates.ContractExpired:
      d = ContractExpired(data);
      break;
    case templates.DeleteRequesttoadmin:
      d = DeleteRequesttoadmin(data);
      break;
    case templates.LeadCreatedByUser:
      d = LeadCreatedByUser(data);
      break;
    case templates.LeadDeleteRequestSendByUser:
      d = LeadDeleteRequestSendByUser(data);
      break;
    case templates.DeleteRequestForQuote:
      d = DeleteRequestForQuote(data);
      break;
    case templates.NewCompanyCreated:
      d = NewCompanyCreated(data);
      break;
    case templates.RenewalProvided:
      d = RenewalProvided(data);
      break;
    case templates.RevisedRenewal:
      d = RevisedRenewal(data);
      break;
    case templates.AcceptRenewalProvided:
      d = AcceptRenewalProvided(data);
      break;
    case templates.RejectRenewalProvided:
      d = RejectRenewalProvided(data);
      break;
    case templates.DNDRenewalProvidedToMgt:
      d = DNDRenewalProvidedToMgt(data);
      break;
    case templates.RenewalInvoiced:
      d = RenewalInvoiced(data);
      break;
    case templates.FlaggedForThirdDay:
      d = FlaggedForThirdDay(data);
      break;
    case templates.FlaggedForOneDay:
      d = FlaggedForOneDay(data);
      break;
    case templates.ReminderMail:
      d = ReminderMail(data);
      break;
    case templates.PendingSupplierConfirmation:
      d = PendingSupplierConfirmation(data);
      break;
    case templates.RevisedSupplierRate:
      d = RevisedSupplierRate(data);
      break;
    case templates.RenewalRevisedSupplierRate:
      d = RenewalRevisedSupplierRate(data);
      break;
    case templates.DebtPaymentAdded:
      d = DebtPaymentAdded(data)
      break;
    case templates.DebtPaymentReminder:
      d = DebtPaymentReminder(data)
      break;
    case templates.AppointmentReminder:
      d = AppoinmentReminder(data)
    default: break;
  }

  const { subject, text, whatsappText }: any = d;
  if (email === 'adminemail') {
    let firstPromise = mailsendMainFunction(process.env.ADMIN_EMAILONE, subject, text);
    let secondPromise = mailsendMainFunction(process.env.ADMIN_EMAILTWO, subject, text);
    let thirdPromise = mailsendMainFunction(process.env.ADMIN_EMAILTHREE, subject, text);
    let fouthPromise = mailsendMainFunction(process.env.ADMIN_EMAILFOUR, subject, text);
    let fifthPromise = mailsendMainFunction(process.env.ADMIN_EMAILFIVE, subject, text);

    Promise
      .all([firstPromise, secondPromise, thirdPromise, fouthPromise, fifthPromise])
      .then(resp => resolve(resp))
      .catch(resp => reject(resp));
  } else {
    let mailOptions = {
      from: process.env.SENDERMAIL,
      to: email,
      subject,
      html: text
    };
    if (data.cc) {
      mailOptions['cc'] = data.cc
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error, 'err')
        reject(error);
      } else {
        console.log(mailOptions)
        console.log(info)
        resolve({ ...info, subject, text, whatsappText });
      }
    });
    return { subject, text, whatsappText }
  }
});


export default {
  templates,
  sendmail,
};
