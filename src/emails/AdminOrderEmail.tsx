import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import type { OrderEmailProps } from "./OrderConfirmationEmail";

// Admin notification — same order data as the customer email, but leads with the
// customer's contact details so the seller can act on it fast.
function rand(amount: number): string {
  return `R${amount.toFixed(2)}`;
}

export default function AdminOrderEmail({
  orderNumber,
  items,
  shipping,
  subtotal,
  total,
}: OrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New order {orderNumber} — {rand(total)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerText}>NEW ORDER</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{orderNumber}</Heading>
            <Text style={paragraph}>
              A new order was just paid for. Total{" "}
              <span style={accent}>{rand(total)}</span>.
            </Text>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Customer
            </Heading>
            <Text style={addressText}>
              {shipping.firstName} {shipping.lastName}
              <br />
              <span style={accent}>{shipping.email}</span>
              <br />
              {shipping.phone}
            </Text>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Ship to
            </Heading>
            <Text style={addressText}>
              {shipping.address1}
              {shipping.address2 ? (
                <>
                  <br />
                  {shipping.address2}
                </>
              ) : null}
              <br />
              {shipping.city}, {shipping.province} {shipping.postalCode}
            </Text>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Items
            </Heading>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>
                    {item.size ? `Size ${item.size} · ` : ""}Qty {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>{rand(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={totalLabel}>{rand(subtotal)}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={grandTotal}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={grandTotalValue}>{rand(total)}</Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden" as const,
};

const header = { backgroundColor: "#0F172A", padding: "20px 32px" };
const headerText = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0",
};

const content = { padding: "32px" };

const h1 = { fontSize: "20px", fontWeight: "700", color: "#DC2626", margin: "0 0 12px" };
const h2 = { fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: "0 0 8px" };

const paragraph = { fontSize: "15px", color: "#334155", margin: "0", lineHeight: "1.5" };
const accent = { color: "#DC2626", fontWeight: "700" };

const hr = { borderColor: "#e2e8f0", margin: "20px 0" };

const itemRow = { marginBottom: "8px" };
const itemName = { fontSize: "14px", color: "#0F172A", fontWeight: "600", margin: "0" };
const itemMeta = { fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" };
const itemPrice = { fontSize: "14px", color: "#0F172A", fontWeight: "600", margin: "0" };

const addressText = { fontSize: "14px", color: "#334155", lineHeight: "1.5", margin: "0" };

const totalLabel = { fontSize: "14px", color: "#334155", margin: "2px 0" };
const grandTotal = { fontSize: "16px", color: "#0F172A", fontWeight: "700", margin: "6px 0 0" };
const grandTotalValue = { fontSize: "16px", color: "#DC2626", fontWeight: "700", margin: "6px 0 0" };
