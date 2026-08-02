/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SendWhatsAppOptions {
  template: 'BOOKING_CONFIRMATION' | 'ADMIN_NEW_BOOKING_ALERT' | 'PROPOSAL_APPROVED_PAYMENT_REQUEST' | 'PAYMENT_RECEIPT_CONFIRMATION' | 'CUSTOM';
  recipientPhone: string;
  data: {
    name?: string;
    eventType?: string;
    eventDate?: string;
    guestCount?: number;
    pricingEstimate?: number;
    depositAmount?: number;
    paymentLink?: string;
    paidAmount?: number;
    transactionId?: string;
    bookingId?: string;
    customMessage?: string;
  };
}

export interface WhatsAppResult {
  success: boolean;
  simulated: boolean;
  recipient: string;
  template: string;
  messageId: string;
  messageSnippet: string;
  error?: string;
}

export function formatWhatsAppMessage(options: SendWhatsAppOptions): string {
  const { template, data } = options;
  const name = data.name || 'Valued Client';
  const formattedEstimate = data.pricingEstimate ? `₹${data.pricingEstimate.toLocaleString('en-IN')}` : '';
  const formattedDeposit = data.depositAmount ? `₹${data.depositAmount.toLocaleString('en-IN')}` : '';
  const formattedPaid = data.paidAmount ? `₹${data.paidAmount.toLocaleString('en-IN')}` : '';

  switch (template) {
    case 'BOOKING_CONFIRMATION':
      return `👑 *Barmantra Royal Mixology Inquiry Received*\n\nNamaste ${name},\nThank you for choosing Barmantra for your upcoming ${data.eventType || 'event'} on ${data.eventDate || 'selected date'}.\n\n📌 *Details*:\n- Guest Count: ${data.guestCount || 'N/A'}\n- Estimated Quote: ${formattedEstimate}\n- 30% Retainer Deposit: ${formattedDeposit}\n\nOur concierge team in Jaipur is reviewing your request. We will reach out shortly with your customized bar theme and menu.`;

    case 'ADMIN_NEW_BOOKING_ALERT':
      return `🍸 *ROYAL CONCIERGE ALERT — NEW INQUIRY*\n\nClient: *${name}*\nPhone: ${options.recipientPhone}\nEvent: ${data.eventType} on ${data.eventDate}\nGuests: ${data.guestCount}\nEstimate: ${formattedEstimate}\n\nPlease review in Royal Command Studio!`;

    case 'PROPOSAL_APPROVED_PAYMENT_REQUEST':
      return `✨ *Barmantra Proposal Approved*\n\nRoyal Greetings ${name},\nYour luxury bar experience for ${data.eventType} on ${data.eventDate} has been officially APPROVED by our concierge!\n\n💳 *30% Deposit Retainer*: ${formattedDeposit}\n\nTo lock your date and bar setup, please complete your deposit via our secure payment portal:\n👉 ${data.paymentLink || '#'}`;

    case 'PAYMENT_RECEIPT_CONFIRMATION':
      return `🎉 *Payment Confirmed — Barmantra*\n\nNamaste ${name},\nWe have successfully received your payment of ${formattedPaid}.\n\n🧾 *Transaction Ref*: ${data.transactionId || 'N/A'}\n📌 *Booking Ref*: ${data.bookingId || 'N/A'}\n\nYour event date is locked in our Royal Calendar. Our lead mixologist will contact you for your cocktail tasting session!`;

    case 'CUSTOM':
    default:
      return data.customMessage || `Message from Barmantra Royal Bartending Service.`;
  }
}

export async function sendWhatsAppNotification(options: SendWhatsAppOptions): Promise<WhatsAppResult> {
  const phoneToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const messageText = formatWhatsAppMessage(options);
  const snippet = messageText.substring(0, 100).replace(/\n/g, ' ') + (messageText.length > 100 ? '...' : '');

  // If live credentials exist, send via Meta Graph API
  if (phoneToken && phoneNumberId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${phoneToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: options.recipientPhone.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: messageText }
        })
      });

      const resData: any = await response.json();
      if (!response.ok) {
        throw new Error(resData?.error?.message || 'WhatsApp Graph API error');
      }

      return {
        success: true,
        simulated: false,
        recipient: options.recipientPhone,
        template: options.template,
        messageId: resData?.messages?.[0]?.id || `wamid-${Date.now()}`,
        messageSnippet: snippet
      };
    } catch (err: any) {
      console.warn(`[WhatsApp API Warning] Falling back to simulated delivery: ${err.message}`);
    }
  }

  // Simulated Dispatch (Sandbox Development Mode)
  console.log(`\n==================================================`);
  console.log(`[WHATSAPP SANDBOX SIMULATOR] Dispatching message:`);
  console.log(`To: ${options.recipientPhone}`);
  console.log(`Template: ${options.template}`);
  console.log(`Content:\n${messageText}`);
  console.log(`==================================================\n`);

  return {
    success: true,
    simulated: true,
    recipient: options.recipientPhone,
    template: options.template,
    messageId: `sim-wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    messageSnippet: snippet
  };
}
