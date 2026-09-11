import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Ruler, ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PropertyGallery } from "@/components/site/property-gallery";
import { LeadForm } from "@/components/site/lead-form";
import { currencyFormat } from "@/components/site/property-card";
import { getPropertyBySlug, getActiveBankAccounts } from "@/lib/data";

export const dynamic = "force-dynamic";

const VERIFICATION_COPY = {
  verified: {
    icon: ShieldCheck,
    label: "Verified by Esema",
    color: "text-[var(--color-forest)]",
    detail: "Title documents and site inspection have been completed and confirmed by our team.",
  },
  in_review: {
    icon: ShieldQuestion,
    label: "Verification in progress",
    color: "text-[var(--color-gold)]",
    detail: "Our team is currently verifying this property's documents and physical condition.",
  },
  unverified: {
    icon: ShieldAlert,
    label: "Not yet verified",
    color: "text-[var(--color-danger)]",
    detail: "This listing has just been submitted and verification has not started.",
  },
} as const;

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const bankAccounts = await getActiveBankAccounts();
  const verification = VERIFICATION_COPY[property.verificationStatus];
  const VerificationIcon = verification.icon;

  return (
    <div className="py-10 md:py-14">
      <Container className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${verification.color}`}>
              <VerificationIcon className="h-4 w-4" /> {verification.label}
            </span>
            {property.status !== "available" ? (
              <span className="rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-white">
                {property.status === "sold" ? "Sold" : "Under Offer"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{verification.detail}</p>

          <h1 className="mt-4 font-display text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
            {property.title}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-ink-soft)]">
            <MapPin className="h-4 w-4" /> {property.addressLine ? `${property.addressLine}, ` : ""}
            {property.city}, {property.state}
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--color-forest)]">
            {currencyFormat(property.price, property.currency)}
            {property.pricePeriod ? (
              <span className="text-base font-normal text-[var(--color-ink-soft)]"> {property.pricePeriod}</span>
            ) : null}
          </p>

          {(property.bedrooms || property.bathrooms || property.sizeSqm) && (
            <div className="mt-5 flex flex-wrap gap-6 border-y border-[var(--color-border)] py-4 text-sm text-[var(--color-ink-soft)]">
              {property.bedrooms ? (
                <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> {property.bedrooms} Bedrooms</span>
              ) : null}
              {property.bathrooms ? (
                <span className="flex items-center gap-2"><Bath className="h-4 w-4" /> {property.bathrooms} Bathrooms</span>
              ) : null}
              {property.sizeSqm ? (
                <span className="flex items-center gap-2"><Ruler className="h-4 w-4" /> {property.sizeSqm} sqm</span>
              ) : null}
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {property.description}
            </p>
          </div>

          {bankAccounts.length > 0 && property.verificationStatus === "verified" ? (
            <div className="mt-8 rounded-lg border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 p-5">
              <h2 className="font-display text-base font-semibold text-[var(--color-navy)]">
                Payment details
              </h2>
              <div className="mt-3 flex gap-2 rounded-md bg-white p-3 text-xs text-[var(--color-ink-soft)]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                <p>
                  Always confirm these details by phone or WhatsApp with our team before sending any
                  money, and never pay anyone claiming to represent us through a different account.
                  We are not able to recover funds sent without confirmation.
                </p>
              </div>
              <dl className="mt-4 space-y-3">
                {bankAccounts.map((acc) => (
                  <div key={acc.id} className="text-sm">
                    <dt className="font-semibold text-[var(--color-navy)]">
                      {acc.bankName} ({acc.currency})
                    </dt>
                    <dd className="text-[var(--color-ink-soft)]">
                      {acc.accountName} — {acc.accountNumber}
                    </dd>
                    {acc.note ? <dd className="text-xs text-[var(--color-ink-soft)]">{acc.note}</dd> : null}
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-[var(--color-border)] bg-white p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-navy)]">
              Interested in this property?
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Send us your details and we&apos;ll get back to you with next steps.
            </p>
            <div className="mt-4">
              <LeadForm type="property_inquiry" propertyId={property.id} submitLabel="Request more info" />
            </div>
          </div>
        </aside>
      </Container>
    </div>
  );
}
