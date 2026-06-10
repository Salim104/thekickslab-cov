import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import type { ContactFormValues } from "@/lib/contactSchema"

export default function ContactEmail({
  name,
  email,
  subject,
  message,
}: ContactFormValues) {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Contact Message</Heading>
          <Text style={label}>Name</Text>
          <Text style={value}>{name}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email}</Text>
          <Text style={label}>Subject</Text>
          <Text style={value}>{subject}</Text>
          <Hr style={hr} />
          <Text style={label}>Message</Text>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Sent from the The Kicks Lab contact form.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
}

const heading = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#0F172A",
  marginBottom: "24px",
}

const label = {
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  color: "#64748b",
  margin: "16px 0 4px",
}

const value = {
  fontSize: "15px",
  color: "#0F172A",
  margin: "0",
}

const messageBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  padding: "16px",
}

const messageText = {
  fontSize: "15px",
  color: "#0F172A",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
}

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
}

const footer = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0",
}
