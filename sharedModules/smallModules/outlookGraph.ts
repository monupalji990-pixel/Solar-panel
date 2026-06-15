// Azure removal stub
// This file previously used @azure/identity to authenticate to Microsoft Graph.
// To remove Azure code paths (and avoid build failures when @azure/identity types/deps are missing),
// we provide a stub that keeps the TypeScript surface area but does not send email.

export type GraphAttachment = {
  filename: string;
  contentType?: string;
  contentBytesBase64: string; // raw bytes base64
};

export async function sendMailWithAttachments(params: {
  senderUser: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlBody: string;
  attachments: GraphAttachment[];
}) {
  // Keep function signature stable so the rest of the app compiles.
  // If email sending is still required, re-introduce a supported auth provider + Graph client.
  void params;
  return {
    success: false,
    skipped: true,
    reason: 'Outlook/Azure mail sending disabled (azure removal stub)',
  };
}


