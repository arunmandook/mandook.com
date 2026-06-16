"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/app/actions/enquiry";
import {
  initialEnquiryState,
  type EnquiryState,
} from "@/app/actions/enquiry-types";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-gold focus:ring-2 focus:ring-gold/30 dark:bg-zinc-900";

function fieldClass(hasError?: string) {
  return `${inputBase} ${
    hasError ? "border-red-500" : "border-black/10 dark:border-white/15"
  }`;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gold px-7 text-base font-semibold text-black transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send enquiry"}
    </button>
  );
}

export default function EnquiryForm() {
  const [state, formAction] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    initialEnquiryState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form once an enquiry is successfully stored.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="mb-1.5 block text-sm font-medium">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jane"
            className={fieldClass(state.errors?.first_name)}
            aria-invalid={Boolean(state.errors?.first_name)}
          />
          {state.errors?.first_name && (
            <p className="mt-1 text-xs text-red-600">{state.errors.first_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="mb-1.5 block text-sm font-medium">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            className={fieldClass()}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_number" className="mb-1.5 block text-sm font-medium">
            Contact number <span className="text-red-500">*</span>
          </label>
          <input
            id="contact_number"
            name="contact"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1 555 123 4567"
            className={fieldClass(state.errors?.contact)}
            aria-invalid={Boolean(state.errors?.contact)}
          />
          {state.errors?.contact && (
            <p className="mt-1 text-xs text-red-600">{state.errors.contact}</p>
          )}
        </div>

        <div>
          <label htmlFor="email_id" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email_id"
            name="email_id"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            className={fieldClass(state.errors?.email_id)}
            aria-invalid={Boolean(state.errors?.email_id)}
          />
          {state.errors?.email_id && (
            <p className="mt-1 text-xs text-red-600">{state.errors.email_id}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            placeholder="United States"
            className={fieldClass()}
          />
        </div>

        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="New York"
            className={fieldClass()}
          />
        </div>
      </div>

      <SubmitButton />

      {/* Status feedback */}
      {state.status !== "idle" && state.message && (
        <p
          aria-live="polite"
          className={`rounded-lg px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
