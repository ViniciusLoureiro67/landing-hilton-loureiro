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

/**
 * WhatsApp dedicado à seção #patrocinio — pré-preenchido com a intenção
 * comercial explícita (lead já leu o pitch, quer o projeto comercial).
 *
 * Persona-alvo: marca/empresa (CMO regional, dono de empresa) entrando
 * direto no funil de patrocínio. Diferencia-se do hero, que captura
 * curiosidade inicial mais ampla (mídia/fã/patrocinador).
 *
 * TODO(cliente): aprovar o texto exato da mensagem.
 */
export const WHATSAPP_PATROCINIO_HREF = buildWhatsappHref(
  "Olá Hilton, vim pelo site oficial e quero conversar sobre patrocínio na temporada Moto1000GP 2026. Pode me enviar o projeto comercial?"
);

export const INSTAGRAM_HREF = "https://www.instagram.com/hilton_loureiro76/";
export const EMAIL_HREF = "mailto:hiltonloureiro@hotmail.com";
