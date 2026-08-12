import { SiteNav } from "./components/SiteNav";
import { DownloadHero } from "./components/DownloadHero";
import { AllInstallers } from "./components/AllInstallers";
import { CliInstall } from "./components/CliInstall";
import { Audiences } from "./components/Audiences";
import { MobileApp } from "./components/MobileApp";
import { SiteFooter } from "./components/SiteFooter";
import { scrollbarStyles } from "@/data/data.styles.scrollbar.js";

export default function DescargarApp() {
  return (
    <div className="min-h-screen bg-primero">
      <SiteNav />
      <main>
        <DownloadHero />
        <AllInstallers />
        <CliInstall />
        <Audiences />
        <MobileApp />
      </main>
      <SiteFooter />

      <style>{scrollbarStyles.default}</style>
    </div>
  );
}
