import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Ruler, ShieldCheck } from "lucide-react";

type PropertyCardData = {
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  price: string;
  currency: string;
  pricePeriod?: string | null;
  city: string;
  state: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  listingSource: "esema_owned" | "partner_verified";
  verificationStatus: "verified" | "in_review" | "unverified";
  status: "available" | "under_offer" | "sold";
};

const currencyFormat = (value: string, currency: string) => {
  const num = Number(value);
  const formatted = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(num);
  const symbol = currency === "NGN" ? "₦" : currency + " ";
  return `${symbol}${formatted}`;
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-paper-tint)]">
        {property.coverImageUrl ? (
          <Image
            src={property.coverImageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-ink-soft)]">
            No image yet
          </div>
        )}

        {property.status !== "available" ? (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-white">
            {property.status === "sold" ? "Sold" : "Under Offer"}
          </span>
        ) : null}

        {property.verificationStatus === "verified" ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--color-gold)]/95 px-3 py-1 text-xs font-semibold text-white">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <p className="flex items-center gap-1 text-xs text-[var(--color-ink-soft)]">
          <MapPin className="h-3.5 w-3.5" /> {property.city}, {property.state}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold text-[var(--color-navy)] line-clamp-1">
          {property.title}
        </h3>
        <p className="mt-1 text-lg font-bold text-[var(--color-forest)]">
          {currencyFormat(property.price, property.currency)}
          {property.pricePeriod ? (
            <span className="text-sm font-normal text-[var(--color-ink-soft)]"> {property.pricePeriod}</span>
          ) : null}
        </p>

        {(property.bedrooms || property.bathrooms || property.sizeSqm) && (
          <div className="mt-3 flex gap-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-ink-soft)]">
            {property.bedrooms ? (
              <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {property.bedrooms}</span>
            ) : null}
            {property.bathrooms ? (
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms}</span>
            ) : null}
            {property.sizeSqm ? (
              <span className="flex items-center gap-1"><Ruler className="h-4 w-4" /> {property.sizeSqm} sqm</span>
            ) : null}
          </div>
        )}
      </div>
    </Link>
  );
}

export { currencyFormat };
