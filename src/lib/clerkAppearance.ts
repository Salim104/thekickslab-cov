// Shared Clerk appearance so the SignIn / SignUp pages and the navbar UserButton
// all match The Kicks Lab brand: red-600 primary, Inter font, square-ish cards.
// (Typed loosely — @clerk/types isn't a direct dependency and strict mode is off.)
export const clerkAppearance = {
  variables: {
    colorPrimary: "#DC2626", // red-600
    colorText: "#0F172A", // brand navy
    fontFamily: "var(--font-sans), Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    formButtonPrimary:
      "bg-red-600 hover:bg-red-700 text-white normal-case font-semibold",
    footerActionLink: "text-red-600 hover:text-red-700",
    // The page provides its own card shell (logo + shadow), so let the Clerk
    // component sit flush inside it.
    card: "shadow-none border-0 bg-transparent",
    headerTitle: "text-xl font-bold",
  },
};
