/**
 * WhatsApp link to Laura with a pre-filled message. Every WhatsApp link on
 * the site is built here (hero buttons, Enquire, footer, Contact, Christmas),
 * so the number lives in one place (Matt, 2026-11-14). The phone-only hero
 * button isn't used on Corporate & brand, where clients tend to email.
 */
export const WHATSAPP_NUMBER = "447872114191";

export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
