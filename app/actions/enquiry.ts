"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EnquiryState } from "@/app/actions/enquiry-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Handles enquiry-form submissions and stores them in the `customers` table.
 * Shaped for React's useActionState: (prevState, formData) => nextState.
 */
export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot: real users never fill this hidden field; bots do.
  if (clean(formData.get("company_website"))) {
    return { status: "success", message: "Thank you! Your enquiry has been received." };
  }

  const first_name = clean(formData.get("first_name"));
  const last_name = clean(formData.get("last_name"));
  const contact = clean(formData.get("contact"));
  const email_id = clean(formData.get("email_id"));
  const country = clean(formData.get("country"));
  const city = clean(formData.get("city"));

  // --- Server-side validation -------------------------------------------
  const errors: EnquiryState["errors"] = {};
  if (!first_name) errors.first_name = "Please enter your first name.";
  if (!contact) errors.contact = "Please enter a contact number.";
  if (email_id && !EMAIL_RE.test(email_id)) errors.email_id = "Please enter a valid email address.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  // --- Persist ----------------------------------------------------------
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("customers").insert({
      first_name,
      last_name: last_name || null,
      contact,
      email_id: email_id || null,
      country: country || null,
      city: city || null,
    });

    if (error) {
      console.error("Enquiry insert failed:", error.message);
      return {
        status: "error",
        message: "Something went wrong saving your enquiry. Please try again.",
      };
    }
  } catch (err) {
    console.error("Enquiry submission error:", err);
    return {
      status: "error",
      message: "Service is temporarily unavailable. Please try again later.",
    };
  }

  return {
    status: "success",
    message: `Thank you, ${first_name}! Your enquiry has been received — I'll be in touch shortly.`,
  };
}
