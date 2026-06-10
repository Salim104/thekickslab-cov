import { Truck, Trophy, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders over R2000",
  },
  {
    icon: Trophy,
    title: "Affordable Prices",
    subtitle: "Get factory direct prices",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    subtitle: "Talk to our specialists",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3 md:px-8">
        {FEATURES.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center justify-center gap-4 md:justify-start">
            <Icon className="h-10 w-10 shrink-0 text-red-600" strokeWidth={1.5} />
            <div>
              <h3 className="text-base font-bold text-neutral-900">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
