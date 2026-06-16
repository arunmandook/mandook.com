// Shared types/constants for the enquiry action.
// Kept out of the "use server" file because such files may only export
// async functions — not objects or plain values.

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Per-field validation errors, keyed by form field name. */
  errors?: Partial<Record<"first_name" | "contact" | "email_id", string>>;
};

export const initialEnquiryState: EnquiryState = {
  status: "idle",
  message: "",
};
