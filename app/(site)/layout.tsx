import { getSiteSettings } from "@/lib/data";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
