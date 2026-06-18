export interface LeadPayload {
  customerId: string;
  createdBy?: string;
  createdByUserId?: string;

  leadType: string;
  appointmentBooker?: string;
  leadGenerator?: string;
  leadContactedOn?: number | string;

  status?: string;
}


