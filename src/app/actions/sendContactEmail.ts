"use server"

import { createElement } from "react"
import { Resend } from "resend"

import ContactEmail from "@/emails/ContactEmail"
import { contactSchema, type ContactFormValues } from "@/lib/contactSchema"

export type SendContactResult = {
  success: boolean
  error?: string
}

export async function sendContactEmail(
  values: ContactFormValues
): Promise<SendContactResult> {
  // Re-validate on the server — Server Actions are reachable via direct POST,
  // so never trust the client-side validation alone.
  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.RESEND_TO_EMAIL
  if (!apiKey || !to) {
    console.error("[sendContactEmail] RESEND_API_KEY or RESEND_TO_EMAIL is not set")
    return { success: false, error: "Email is not configured." }
  }

  const { name, email, subject, message } = parsed.data

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: "The Kicks Lab <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `New contact: ${subject}`,
      react: createElement(ContactEmail, { name, email, subject, message }),
    })

    if (error) {
      console.error("[sendContactEmail] Resend error:", error)
      return { success: false, error: "Failed to send message." }
    }

    return { success: true }
  } catch (err) {
    console.error("[sendContactEmail] Unexpected error:", err)
    return { success: false, error: "Failed to send message." }
  }
}
