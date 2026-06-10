import Link from "next/link";
import Image from "next/image";

const COMPANY_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Store Locations", href: "#" },
  { label: "Our Blog", href: "#" },
  { label: "Reviews", href: "#" },
];

const HELP_LINKS = [
  { label: "Customer Service", href: "#" },
  { label: "My Account", href: "/account" },
  { label: "Find a Store", href: "#" },
  { label: "Legal & Privacy", href: "#" },
  { label: "Contact", href: "/contact" },
  { label: "Gift Cards", href: "#" },
];

const SUPPORT_LINKS = [
  { label: "Shipping Policy", href: "#" },
  { label: "Returns & Exchanges", href: "#" },
  { label: "Authenticity Guarantee", href: "#" },
  { label: "FAQ", href: "#" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/assets/main-logo.png"
                alt="The Kicks Lab"
                width={140}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-neutral-400">
              Premium sneakers, authenticated and delivered across South Africa.
              The Kicks Lab is your trusted home for the freshest kicks.
            </p>
          </div>

          <LinkColumn title="COMPANY" links={COMPANY_LINKS} />
          <LinkColumn title="HELP" links={HELP_LINKS} />
          <LinkColumn title="SUPPORT" links={SUPPORT_LINKS} />
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-xs text-neutral-500">
            Copyright © 2025 The Kicks Lab • Developed by The Dev
          </p>
        </div>
      </div>
    </footer>
  );
}
