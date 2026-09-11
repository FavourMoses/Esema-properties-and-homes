import Image from "next/image";
import { MapPin, ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";
import { getCustomerSession } from "@/lib/customer-auth";
import { getPropertiesForCustomer, getVisibleUpdatesForProperty } from "@/lib/data";
import { currencyFormat } from "@/components/site/property-card";

export const dynamic = "force-dynamic";

const VERIFICATION_COPY = {
  verified: { icon: ShieldCheck, label: "Verified", color: "text-[var(--color-forest)]" },
  in_review: { icon: ShieldQuestion, label: "Verification in progress", color: "text-[var(--color-gold)]" },
  unverified: { icon: ShieldAlert, label: "Not yet verified", color: "text-[var(--color-danger)]" },
} as const;

export default async function PortalDashboardPage() {
  const session = await getCustomerSession();
  const properties = session ? await getPropertiesForCustomer(session.id) : [];

  if (properties.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-8 text-center text-sm text-[var(--color-ink-soft)]">
        No property is linked to your account yet. Contact your Esema representative if you believe this is a mistake.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {await Promise.all(
        properties.map(async (property) => {
          const updates = await getVisibleUpdatesForProperty(property.id);
          const verification = VERIFICATION_COPY[property.verificationStatus];
          const VerificationIcon = verification.icon;

          return (
            <section key={property.id} className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-xl font-bold text-[var(--color-navy)]">{property.title}</h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-ink-soft)]">
                    <MapPin className="h-4 w-4" /> {property.city}, {property.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[var(--color-forest)]">
                    {currencyFormat(property.price, property.currency)}
                  </p>
                  <p className={`mt-1 flex items-center justify-end gap-1 text-xs font-semibold ${verification.color}`}>
                    <VerificationIcon className="h-3.5 w-3.5" /> {verification.label}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                <h2 className="font-display text-sm font-semibold text-[var(--color-navy)]">Progress updates</h2>

                {updates.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
                    No updates have been posted yet — check back soon.
                  </p>
                ) : (
                  <ol className="mt-4 space-y-6">
                    {updates.map((update) => (
                      <li key={update.id} className="border-l-2 border-[var(--color-forest)] pl-4">
                        <p className="text-xs text-[var(--color-ink-soft)]">
                          {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(update.createdAt)}
                        </p>
                        <h3 className="mt-1 font-display text-sm font-semibold text-[var(--color-navy)]">
                          {update.title}
                        </h3>
                        <p className="mt-1 whitespace-pre-line text-sm text-[var(--color-ink-soft)]">
                          {update.message}
                        </p>
                        {update.images.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {update.images.map((url, i) => (
                              <div key={url + i} className="relative h-20 w-24 overflow-hidden rounded-md">
                                <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
