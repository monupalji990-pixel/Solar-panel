import axios from 'axios';
import DocumentTimelineModel from '../../models/DocumentTimeline';
import QuoteModel from '../../models/Quotes';
import LeadModel from '../../models/Lead';
import UserModel from '../../models/user';
import { sendMailWithAttachments } from '../../sharedModules/smallModules/outlookGraph';

// First cut:
// - Detect handover pack "ready" when all REQUIRED_TEMPLATE_TYPES exist with status: Sent for the Quote.
// - Email customer via Outlook (Microsoft Graph) with those documents as attachments.
// - Idempotency: mark handoverEmailSentAt on DocumentTimeline records.

const REQUIRED_TEMPLATE_TYPES: string[] = [
  'Contract',
  'Installation',
  'Warranties',
  'MCS',
  'DNO',
  'BuildingRegs',
  'HIES',
];

function buildHandoverEmailHtml(params: {
  customerName?: string;
  quoteId?: string;
  attachmentsCount: number;
}) {
  const name = params.customerName ? `<b>${params.customerName}</b>` : 'customer';
  const quote = params.quoteId ? `<b>${params.quoteId}</b>` : '';

  return `
  <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
    <p>Dear ${name},</p>
    <p>Please find attached your <b>Handover Pack</b>${quote ? ` for ${quote}` : ''}.</p>
    <p>The pack includes the relevant contract, installation, certificates and approvals documents.</p>
    <p><i>Attachments included: ${params.attachmentsCount}</i></p>
    <p>Kind regards,<br/>Edan Power</p>
  </div>`;
}

async function fetchUrlAsBase64(fileUrl: string) {
  const resp = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  const b64 = Buffer.from(resp.data, 'binary').toString('base64');
  const contentType = resp.headers && resp.headers['content-type'] ? resp.headers['content-type'] : undefined;
  return { contentBytesBase64: b64, contentType };
}

async function findCustomerEmailForQuote(quote: any) {
  // Attempt 1: quote.Consumer -> User
  if (quote && quote.Consumer) {
    const u = await UserModel.findById(quote.Consumer)
      .select('email firstName surName title')
      .lean();
    if (u && u.email) return u;
  }

  // Attempt 2: quote.Lead -> customerId/Consumer/Contact
  if (quote && quote.Lead) {
    const lead = await LeadModel.findById(quote.Lead)
      .select('customerId Consumer Contact')
      .lean();

    const consumerId = (lead && (lead.customerId || lead.Consumer || lead.Contact)) || null;
    if (consumerId) {
      const u = await UserModel.findById(consumerId)
        .select('email firstName surName title')
        .lean();
      if (u && u.email) return u;
    }
  }

  return null;
}

export default class HandoverEmailController {
  async sendHandoverForQuote(args: { quoteId: string }) {
    const quote = await QuoteModel.findOne({ QuoteID: args.quoteId }).populate('Company').populate('Consumer').lean();
    if (!quote) {
      throw new Error('Quote not found for QuoteID=' + args.quoteId);
    }

    // Idempotency check: if any document is already marked, skip.
    const already = await DocumentTimelineModel.findOne({
      quoteId: quote._id,
      handoverEmailSentAt: { $ne: null },
    }).lean();

    if (already) {
      return { success: true, skipped: true, reason: 'already sent' };
    }

    const docs = await DocumentTimelineModel.find({
      quoteId: quote._id,
      status: 'Sent',
    }).lean();

    const byType: Record<string, any[]> = {};
    (docs || []).forEach((d: any) => {
      const t = d.templateType;
      if (!t) return;
      if (!byType[t]) byType[t] = [];
      byType[t].push(d);
    });

    const missing = REQUIRED_TEMPLATE_TYPES.filter(function (t) {
      return !byType[t] || byType[t].length === 0;
    });

    if (missing.length > 0) {
      return { success: false, skipped: true, reason: 'handover pack not ready', missing };
    }

    // Collect attachments.
    const requiredDocs: any[] = [];
    REQUIRED_TEMPLATE_TYPES.forEach(function (t) {
      (byType[t] || []).forEach(function (d) {
        requiredDocs.push(d);
      });
    });

    const attachments: any[] = [];
    for (let i = 0; i < requiredDocs.length; i++) {
      const d = requiredDocs[i];
      const url = d.sentDocumentUrl;
      if (!url) continue;
      const { contentBytesBase64, contentType } = await fetchUrlAsBase64(url);
      attachments.push({
        filename: d.receivedFileName || d.filename || (d.templateType + '.pdf'),
        contentType: contentType || undefined,
        contentBytesBase64: contentBytesBase64,
      });
    }

    if (attachments.length === 0) {
      return { success: false, skipped: true, reason: 'no attachments found' };
    }

    const customer = await findCustomerEmailForQuote(quote);
    if (!customer || !customer.email) {
      return { success: false, skipped: true, reason: 'customer email not found' };
    }

    const senderUser = process.env.OUTLOOK_SENDER_EMAIL;
    if (!senderUser) {
      throw new Error('Missing OUTLOOK_SENDER_EMAIL env var');
    }

    const htmlBody = buildHandoverEmailHtml({
      customerName: [customer.title, customer.firstName, customer.surName].filter(Boolean).join(' '),
      quoteId: quote.QuoteID,
      attachmentsCount: attachments.length,
    });

    await sendMailWithAttachments({
      senderUser: senderUser,
      to: [customer.email],
      subject: 'Your Handover Pack' + (quote.QuoteID ? ' – ' + quote.QuoteID : ''),
      htmlBody: htmlBody,
      attachments: attachments,
    });

    // Mark handover email sent on all the required docs (best-effort).
    await DocumentTimelineModel.updateMany(
      { _id: { $in: requiredDocs.map(function (x) { return x._id; }) } },
      { handoverEmailSentAt: new Date(), handoverEmailQuoteId: quote.QuoteID },
    );

    return { success: true, sent: true, attachments: attachments.length };
  }

  async cronSendPendingHandoverEmails() {
    // Look for any Sent handover-related docs that haven't been marked as emailed yet.
    const docs = await DocumentTimelineModel.find({
      status: 'Sent',
      handoverEmailSentAt: null,
      templateType: { $in: REQUIRED_TEMPLATE_TYPES },
    }).lean();

    const quoteObjectIds: string[] = [];
    const seen: Record<string, boolean> = {};
    (docs || []).forEach((d: any) => {
      if (!d || !d.quoteId) return;
      const key = String(d.quoteId);
      if (seen[key]) return;
      seen[key] = true;
      quoteObjectIds.push(key);
    });

    const results: any[] = [];

    for (let i = 0; i < quoteObjectIds.length; i++) {
      const qid = quoteObjectIds[i];
      const q = await QuoteModel.findById(qid).select('QuoteID _id').lean();
      if (!q || !q.QuoteID) continue;

      try {
        const r = await this.sendHandoverForQuote({ quoteId: q.QuoteID });
        results.push({ QuoteID: q.QuoteID, success: r.success !== false, skipped: r.skipped, reason: r.reason || null, sent: r.sent || false });
      } catch (e) {
        const err: any = e;
        results.push({ QuoteID: q.QuoteID, success: false, error: err && err.message ? err.message : String(err) });
      }
    }

    return { success: true, resultsCount: results.length, results: results };
  }
}

