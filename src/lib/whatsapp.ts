/**
 * WhatsApp link to Laura with a pre-filled message. Used for the phone-only
 * "WhatsApp Laura now" button under the hero CTA (Matt, 2026-11-06).
 * Not used on Corporate & brand, where clients tend to email.
 */
export const WHATSAPP_NUMBER = "447872114191";

export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
