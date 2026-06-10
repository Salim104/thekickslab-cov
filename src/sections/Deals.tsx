import Link from "next/link";
import Image from "next/image";

export default function Deals() {
  return (
    <section className="bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row md:px-8 md:py-0">
        <div className="text-center text-white md:w-1/2 md:text-left">
          <h2 className="mb-4 text-5xl font-bold">
            30% <span className="text-red-600">OFF</span>
          </h2>
          <p className="mb-6 text-lg">Hot &amp; Exclusive deals</p>
          <Link
            href="/shop"
            className="inline-block rounded-sm bg-white px-6 py-2 font-medium text-black transition-colors hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/assets/deals-image.png"
            alt="Special deals"
            width={600}
            height={400}
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
