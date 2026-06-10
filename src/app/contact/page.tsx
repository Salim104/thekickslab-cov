import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"

import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | The Kicks Lab",
  description:
    "Get in touch with The Kicks Lab — questions about orders, sizing, or anything sneakers.",
}

const infoCards = [
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@thekickslab.com"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+27 12 345 6789"],
  },
  {
    icon: MapPin,
    title: "Location",
    lines: ["123 Sneaker Street", "Cape Town, South Africa"],
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <ContactForm />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {infoCards.map(({ icon: Icon, title, lines }) => (
          <div
            key={title}
            className="bg-white p-6 rounded-lg shadow-md text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Icon className="h-5 w-5 text-black" />
            </div>
            <h2 className="font-bold mb-1">{title}</h2>
            {lines.map((line) => (
              <p key={line} className="text-gray-500 text-sm">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
