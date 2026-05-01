"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { buildWhatsappFormHref } from "@/lib/links";

/**
 * ContatoForm — coleta nome / empresa / interesse / mensagem e abre o
 * WhatsApp com a mensagem pré-formatada. Sem backend: o "submit" é só
 * abrir `wa.me/<numero>?text=<msg>` em nova aba. O usuário revisa no
 * WhatsApp e envia. Cobre 95% dos leads em BR sem precisar de
 * Resend/Formspree/SMTP.
 *
 * Quando o cliente quiser swap pra um backend real (envio direto pro
 * email), o handler `onSubmit` é o único ponto de mudança — o form
 * inteiro fica intacto.
 */

type Interesse = "patrocinio" | "imprensa" | "outro";

const INTERESSE_OPTIONS: Array<{ value: Interesse; label: string; tag: string }> = [
  { value: "patrocinio", label: "Patrocínio", tag: "Pra marcas" },
  { value: "imprensa", label: "Imprensa", tag: "Pra mídia" },
  { value: "outro", label: "Outro", tag: "Geral" },
];

type FormState = {
  nome: string;
  empresa: string;
  interesse: Interesse;
  mensagem: string;
};

const INITIAL: FormState = {
  nome: "",
  empresa: "",
  interesse: "patrocinio",
  mensagem: "",
};

function buildMessage(state: FormState): string {
  const interesseLabel = INTERESSE_OPTIONS.find(
    (o) => o.value === state.interesse
  )?.label;
  const empresaLine = state.empresa.trim()
    ? ` da ${state.empresa.trim()}`
    : "";
  return [
    `Olá Hilton, sou ${state.nome.trim()}${empresaLine}.`,
    `Tenho interesse em: ${interesseLabel}.`,
    "",
    state.mensagem.trim(),
  ].join("\n");
}

export function ContatoForm() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const isValid = state.nome.trim().length >= 2 && state.mensagem.trim().length >= 4;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    const href = buildWhatsappFormHref(buildMessage(state));
    // Pequeno delay pra mostrar o feedback visual antes de abrir.
    setTimeout(() => {
      globalThis.open(href, "_blank", "noopener,noreferrer");
      setSubmitting(false);
    }, 250);
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Formulário de contato — abre o WhatsApp com a mensagem pré-preenchida"
      className="relative flex flex-col gap-6"
    >
      {/* Linha decorativa de moldura — corner brackets nos cantos do form. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-3 -top-3 size-4 border-l border-t border-racing-white/30"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-3 size-4 border-r border-t border-racing-white/30"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -left-3 size-4 border-b border-l border-racing-white/30"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -right-3 size-4 border-b border-r border-racing-white/30"
      />

      {/* Field: Nome */}
      <Field label="Nome" htmlFor="contato-nome" required>
        <input
          id="contato-nome"
          name="nome"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          value={state.nome}
          onChange={(e) => setState({ ...state, nome: e.target.value })}
          className={inputClassName}
          placeholder="Como devemos chamar você?"
        />
      </Field>

      {/* Field: Empresa/Marca (opcional) */}
      <Field label="Empresa / Marca" htmlFor="contato-empresa" optional>
        <input
          id="contato-empresa"
          name="empresa"
          type="text"
          autoComplete="organization"
          value={state.empresa}
          onChange={(e) => setState({ ...state, empresa: e.target.value })}
          className={inputClassName}
          placeholder="Opcional — se você representa uma marca"
        />
      </Field>

      {/* Field: Interesse (radio chips) */}
      <fieldset>
        <legend className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute">
          <span className="text-racing-red">·</span> Interesse
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESSE_OPTIONS.map((opt) => {
            const checked = state.interesse === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "group relative flex cursor-pointer flex-col gap-0.5 rounded-sm border px-4 py-3 transition-[border-color,background-color] duration-300",
                  checked
                    ? "border-racing-red bg-racing-red/10"
                    : "border-racing-white/15 bg-transparent hover:border-racing-white/35"
                )}
              >
                <input
                  type="radio"
                  name="interesse"
                  value={opt.value}
                  checked={checked}
                  onChange={() =>
                    setState({ ...state, interesse: opt.value })
                  }
                  className="sr-only"
                />
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-racing-white">
                  {opt.label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-racing-mute">
                  {opt.tag}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Field: Mensagem */}
      <Field label="Mensagem" htmlFor="contato-mensagem" required>
        <textarea
          id="contato-mensagem"
          name="mensagem"
          required
          minLength={4}
          rows={5}
          value={state.mensagem}
          onChange={(e) => setState({ ...state, mensagem: e.target.value })}
          className={cn(inputClassName, "resize-none")}
          placeholder="Conte rapidamente o que você tem em mente — projeto comercial, dúvida, pauta editorial..."
        />
      </Field>

      {/* Submit */}
      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/80">
          Vai abrir o WhatsApp com sua mensagem pronta — você só revisa e envia.
        </p>
        <motion.button
          type="submit"
          disabled={!isValid || submitting}
          whileTap={reduce || !isValid ? undefined : { scale: 0.97 }}
          className={cn(
            "group relative inline-flex h-12 min-w-[14rem] items-center justify-center gap-2 overflow-hidden rounded-lg px-6 font-heading text-sm font-bold uppercase tracking-widest transition-[background-color,color,box-shadow] duration-300",
            isValid
              ? "bg-racing-red text-racing-white hover:shadow-[0_8px_28px_-8px_oklch(0.58_0.23_27_/_0.7)]"
              : "cursor-not-allowed bg-racing-white/10 text-racing-white/45"
          )}
        >
          <span className="relative z-10">
            {submitting ? "Abrindo WhatsApp..." : "Enviar pelo WhatsApp"}
          </span>
          <ArrowUpRight className="relative z-10 size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

          {/* Sweep diagonal no hover */}
          {isValid ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-racing-white/20 to-transparent opacity-0 transition-[opacity,transform] duration-700 group-hover:translate-x-[400%] group-hover:opacity-100"
            />
          ) : null}
        </motion.button>
      </div>
    </form>
  );
}

const inputClassName =
  "block w-full rounded-sm border border-racing-white/15 bg-racing-blue-deep/40 px-4 py-3 font-sans text-base text-racing-white outline-none transition-[border-color,background-color] duration-300 placeholder:text-racing-white/35 hover:border-racing-white/30 focus-visible:border-racing-blue-bright focus-visible:bg-racing-blue-deep/60 focus-visible:ring-2 focus-visible:ring-racing-blue-bright/30";

function Field({
  label,
  htmlFor,
  required,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute"
      >
        <span className="text-racing-red">·</span> {label}
        {required ? (
          <span className="ml-1 text-racing-red">*</span>
        ) : optional ? (
          <span className="ml-2 text-racing-mute/55">opcional</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
