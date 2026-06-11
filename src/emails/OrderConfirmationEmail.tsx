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

// Shared shape for both order emails. Mirrors the Convex order doc fields the
// templates need (prices already in Rand).
export type OrderEmailItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

export type OrderEmailShipping = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
};

export type OrderEmailProps = {
  orderNumber: string;
  items: OrderEmailItem[];
  shipping: OrderEmailShipping;
  subtotal: number;
  total: number;
};

// Plain Rand formatter — can't import the app's client util into the email
// render path, so keep a tiny local copy (R1799.99, no space).
function rand(amount: number): string {
  return `R${amount.toFixed(2)}`;
}

export default function OrderConfirmationEmail({
  orderNumber,
  items,
  shipping,
  subtotal,
  total,
}: OrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your The Kicks Lab order {orderNumber} is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerText}>THE KICKS LAB</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Order Confirmed 🎉</Heading>
            <Text style={paragraph}>
              Thanks for your order, {shipping.firstName}! We&apos;ve received your
              payment and are getting your sneakers ready.
            </Text>
            <Text style={orderNo}>
              Order number: <span style={orderNoValue}>{orderNumber}</span>
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
                <Text style={grandTotal}>Total Paid</Text>
              </Column>
              <Column align="right">
                <Text style={grandTotalValue}>{rand(total)}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Shipping to
            </Heading>
            <Text style={addressText}>
              {shipping.firstName} {shipping.lastName}
              <br />
              {shipping.address1}
              {shipping.address2 ? (
                <>
                  <br />
                  {shipping.address2}
                </>
              ) : null}
              <br />
              {shipping.city}, {shipping.province} {shipping.postalCode}
              <br />
              {shipping.phone}
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              The Kicks Lab · Premium sneakers, delivered across South Africa.
            </Text>
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

const header = {
  backgroundColor: "#0F172A",
  padding: "20px 32px",
};

const headerText = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0",
};

const content = { padding: "32px" };

const h1 = { fontSize: "22px", fontWeight: "700", color: "#0F172A", margin: "0 0 12px" };
const h2 = { fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: "0 0 12px" };

const paragraph = { fontSize: "15px", color: "#334155", margin: "0 0 12px", lineHeight: "1.5" };

const orderNo = { fontSize: "14px", color: "#64748b", margin: "0" };
const orderNoValue = { color: "#DC2626", fontWeight: "700" };

const hr = { borderColor: "#e2e8f0", margin: "20px 0" };

const itemRow = { marginBottom: "8px" };
const itemName = { fontSize: "14px", color: "#0F172A", fontWeight: "600", margin: "0" };
const itemMeta = { fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" };
const itemPrice = { fontSize: "14px", color: "#0F172A", fontWeight: "600", margin: "0" };

const totalLabel = { fontSize: "14px", color: "#334155", margin: "2px 0" };
const grandTotal = { fontSize: "16px", color: "#0F172A", fontWeight: "700", margin: "6px 0 0" };
const grandTotalValue = { fontSize: "16px", color: "#DC2626", fontWeight: "700", margin: "6px 0 0" };

const addressText = { fontSize: "14px", color: "#334155", lineHeight: "1.5", margin: "0" };

const footer = { backgroundColor: "#f8fafc", padding: "20px 32px" };
const footerText = { fontSize: "12px", color: "#94a3b8", margin: "0", textAlign: "center" as const };
