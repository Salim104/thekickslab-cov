import { z } from "zod";

// South African provinces — the only valid values for the shipping dropdown.
export const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Free State",
  "Northern Cape",
] as const;

// Shared by the client form (ShippingForm) and the server action so validation
// can't drift. All fields required except address2. zod v4 top-level z.email().
export const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone number is required"),
  address1: z.string().trim().min(1, "Address is required"),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  province: z.enum(SA_PROVINCES, { message: "Select a province" }),
  postalCode: z.string().trim().min(1, "Postal code is required"),
});

export type ShippingValues = z.infer<typeof shippingSchema>;
