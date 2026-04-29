/**
 * Links externos centralizados — facilita refactor e mantém copy
 * pré-preenchida das CTAs em um só lugar.
 *
 * TODO(cliente): confirmar número WhatsApp oficial. Hoje usamos
 * o (82) 99669-6666 herdado do material da imprensa. Se o cliente
 * preferir outro canal, trocar aqui e os componentes seguem.
 */

const WHATSAPP_PHONE = "5582996696666";

function buildWhatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** WhatsApp genérico (Navbar, Footer) — mensagem neutra. */
export const WHATSAPP_HREF = buildWhatsappHref(
  "Olá Hilton, vim pelo site oficial e gostaria de conversar."
);

/**
 * WhatsApp do Hero — pré-preenchido para qualificar o lead já no clique.
 * Persona-alvo: patrocinador / mídia chegando pela primeira vez.
 */
export const WHATSAPP_HERO_HREF = buildWhatsappHref(
  "Olá Hilton, vim pelo site oficial e quero saber mais sobre o projeto da temporada 2026."
);

export const INSTAGRAM_HREF = "https://www.instagram.com/hilton_loureiro76/";
export const EMAIL_HREF = "mailto:hiltonloureiro@hotmail.com";
