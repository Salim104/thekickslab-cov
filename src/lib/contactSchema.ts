import { z } from "zod"

// Shared between the client form (validation) and the Server Action (re-validation).
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
})

export type ContactFormValues = z.infer<typeof contactSchema>
