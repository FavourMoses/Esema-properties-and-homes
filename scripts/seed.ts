import { config } from "dotenv";
config({ path: ".env.local" });

// Loaded dynamically (not as a static import) so .env.local is guaranteed
// to be read first — static imports run before any other code in the file,
// even code written above them, which was the cause of the DATABASE_URL
// error.
import bcrypt from "bcryptjs";

// Run this once, right after your first migration, to give the site some
// starting content instead of launching empty. Safe to re-run for the admin
// user and services (both have unique keys), but trust features and
// verification steps will duplicate on a second run — clear those tables
// first if you need to reseed them.
async function main() {
  const { db, schema } = await import("../lib/db");
  console.log("Seeding Esema Properties & Homes...");

  // ── Site settings ─────────────────────────────────────────────────────
  const branding = {
    logoUrl: "/images/brand/logo-full.png",
    heroImageUrl: "/images/properties/lekki-duplex-exterior.jpg",
    aboutImageUrl: "/images/interiors/living-room-2.jpg",
  };

  await db
    .insert(schema.siteSettings)
    .values({
      id: 1,
      siteName: "Esema Properties & Homes",
      tagline: "Building Dreams. Creating Value.",
      heroTitle: "Esema Properties & Homes",
      heroSubtitle:
        "We deliver quality, affordable, and verified properties across Nigeria — and stand beside you at every step, from land verification to handover.",
      heroCtaPrimaryLabel: "Explore Properties",
      heroCtaPrimaryHref: "/properties",
      heroCtaSecondaryLabel: "How Verification Works",
      heroCtaSecondaryHref: "/services",
      aboutHeading: "About Esema Properties & Homes",
      aboutBody:
        "Esema Properties & Homes helps people buy property anywhere in Nigeria with confidence — whether it's a home we've built ourselves or a listing from a trusted partner we've personally verified. Every property goes through the same process: land verification, a physical site inspection, and — where construction is involved — ongoing monitoring until handover.",
      phone: "+234 000 000 0000",
      email: "info@esemaproperties.com",
      address: "Nigeria",
      footerNote: "© Esema Properties & Homes. All rights reserved.",
      ...branding,
    })
    .onConflictDoUpdate({ target: schema.siteSettings.id, set: branding });

  // ── Trust features (hero strip) ─────────────────────────────────────────
  await db.insert(schema.trustFeatures).values([
    { icon: "Home", title: "Quality Homes", description: "We build and select with premium materials and modern finishes.", sortOrder: 1 },
    { icon: "ShieldCheck", title: "Trusted & Reliable", description: "Transparent processes you can trust, from start to finish.", sortOrder: 2 },
    { icon: "Handshake", title: "Customer Focused", description: "Your satisfaction is our priority. We build for you.", sortOrder: 3 },
    { icon: "TrendingUp", title: "Great Investment", description: "Properties that grow in value and secure your future.", sortOrder: 4 },
  ]).onConflictDoNothing();

  // ── The 4 services the client asked for ─────────────────────────────────
  await db.insert(schema.services).values([
    {
      slug: "land-verification",
      icon: "MapPinCheck",
      title: "Land Verification",
      shortDescription: "We confirm title documents and ownership before you commit a naira.",
      fullDescription:
        "Before any property is listed or any payment is made, our team verifies land title documents, surveys, and government records to confirm the property is genuine and free of disputes.",
      sortOrder: 1,
    },
    {
      slug: "site-inspection-reports",
      icon: "ClipboardCheck",
      title: "Site Inspection Reports",
      shortDescription: "A physical, photographed inspection — even if you're buying from abroad.",
      fullDescription:
        "We visit every property in person, document its true condition with photos and notes, and share a full inspection report with you before you make a decision.",
      sortOrder: 2,
    },
    {
      slug: "construction-monitoring",
      icon: "HardHat",
      title: "Construction Monitoring",
      shortDescription: "Regular, photographed progress updates on any property under construction.",
      fullDescription:
        "For properties still being built, we visit the site on a regular schedule, track progress against the building plan, and share updates so you always know exactly where things stand.",
      sortOrder: 3,
    },
    {
      slug: "vetted-builders-network",
      icon: "Users",
      title: "Vetted Builders Network",
      shortDescription: "A small, trusted network of builders we've personally vetted and worked with.",
      fullDescription:
        "We work with a deliberately small group of builders and contractors whose past work we've inspected and whose reliability we can vouch for — not an open marketplace of unknown names.",
      sortOrder: 4,
    },
  ]).onConflictDoNothing();

  // ── Verification process steps ───────────────────────────────────────────
  await db.insert(schema.verificationSteps).values([
    { stepNumber: 1, title: "Tell us what you need", description: "Share the property you're interested in, or what you're looking for and where." },
    { stepNumber: 2, title: "We verify the land", description: "Title documents and ownership records are checked before anything moves forward." },
    { stepNumber: 3, title: "We inspect the site", description: "A physical visit and photographed report, whether the property is built or under construction." },
    { stepNumber: 4, title: "You pay with confidence", description: "Once verified, we confirm payment details with you directly before any money changes hands." },
  ]).onConflictDoNothing();

  // ── Starter property listings — replace or add to these from the admin
  // dashboard any time. Cities are just examples across major Nigerian
  // markets; edit freely in Properties → Edit.
  const starterProperties: {
    slug: string;
    title: string;
    description: string;
    propertyType: "house" | "land" | "apartment" | "duplex" | "commercial";
    price: string;
    state: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    sizeSqm: number;
    isFeatured: boolean;
    images: string[];
  }[] = [
    {
      slug: "lekki-contemporary-duplex",
      title: "Contemporary Duplex, Lekki",
      description:
        "A striking five-bedroom duplex finished to a high standard, with a private driveway, landscaped garden, and floor-to-ceiling glazing throughout the living areas. Fully verified and ready for immediate handover.",
      propertyType: "duplex",
      price: "185000000",
      state: "Lagos",
      city: "Lekki",
      bedrooms: 5,
      bathrooms: 6,
      sizeSqm: 650,
      isFeatured: true,
      images: [
        "/images/properties/lekki-duplex-exterior.jpg",
        "/images/interiors/bedroom.jpg",
        "/images/interiors/living-room-1.jpg",
      ],
    },
    {
      slug: "victoria-gardens-townhomes",
      title: "Victoria Gardens Townhomes",
      description:
        "A gated row of modern four-bedroom townhomes with private parking, mature landscaping, and 24-hour estate security. Each unit shares the same premium finish, from marble kitchen islands to floor-to-ceiling windows.",
      propertyType: "house",
      price: "95000000",
      state: "Lagos",
      city: "Victoria Island",
      bedrooms: 4,
      bathrooms: 5,
      sizeSqm: 320,
      isFeatured: true,
      images: [
        "/images/properties/victoria-gardens-townhomes.jpg",
        "/images/interiors/kitchen-dining.jpg",
      ],
    },
    {
      slug: "esema-residence-maitama",
      title: "Esema Residence — Serviced Apartments",
      description:
        "A gated residential development of serviced apartments and townhouses set around a landscaped courtyard, with dedicated parking, solar backup power, and full estate security. Verified and available for immediate move-in.",
      propertyType: "apartment",
      price: "120000000",
      state: "Abuja (FCT)",
      city: "Maitama",
      bedrooms: 3,
      bathrooms: 3,
      sizeSqm: 180,
      isFeatured: true,
      images: [
        "/images/properties/esema-residence-day.jpg",
        "/images/properties/esema-residence-dusk.jpg",
        "/images/interiors/living-room-2.jpg",
      ],
    },
  ];

  for (const p of starterProperties) {
    const [property] = await db
      .insert(schema.properties)
      .values({
        slug: p.slug,
        title: p.title,
        description: p.description,
        propertyType: p.propertyType,
        listingSource: "esema_owned",
        status: "available",
        verificationStatus: "verified",
        price: p.price,
        currency: "NGN",
        state: p.state,
        city: p.city,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        sizeSqm: p.sizeSqm,
        coverImageUrl: p.images[0],
        isFeatured: p.isFeatured,
      })
      .onConflictDoNothing()
      .returning({ id: schema.properties.id });

    // onConflictDoNothing returns [] if the slug already existed — skip
    // re-adding images in that case so re-running the seed stays safe.
    if (property) {
      await db.insert(schema.propertyImages).values(
        p.images.map((url, i) => ({ propertyId: property.id, url, sortOrder: i }))
      );
    }
  }

  // ── Admin user ────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@esemaproperties.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.insert(schema.adminUsers).values({
    email: adminEmail,
    passwordHash,
    name: "Esema Admin",
    role: "owner",
  }).onConflictDoNothing();

  console.log("Done.");
  console.log(`Seeded ${starterProperties.length} starter properties (edit or delete them any time from Properties in the dashboard).`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("⚠ Change this password immediately after first login — there's no reset-password flow yet, so update it directly via a new hashed value if you ever forget it.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
