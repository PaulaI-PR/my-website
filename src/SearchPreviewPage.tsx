import { Footer } from "@pikonen/second-design-system";
import { useContent } from "./content";
import { SiteHeader } from "./SiteHeader";

// A reference page for the search feature: the live site, shown in two frames
// at the design's two widths. Each frame is a real page load, so the layout
// responds to its own width exactly as it does on the site, and the search icon
// works inside either frame.
//
// The frames load the results page, which exercises the header, the search
// dialog and the result list in one go. Desktop fills the column; mobile is the
// 390px frame from the design, and shrinks only if the window is narrower.

const PREVIEW_PATH = "#/search?q=design";

export function SearchPreviewPage() {
  const content = useContent();

  if (!content) return null;

  // BASE_URL is "/" in dev and in a root-level build. The frame needs the
  // absolute path, because a bare "#..." would load this page into itself.
  const src = `${import.meta.env.BASE_URL}${PREVIEW_PATH}`;

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteHeader content={content} />

      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-40 px-16 pt-16 pb-40 md:pt-24 md:pb-48">
          <header className="flex flex-col gap-8">
            <h1 className="text-h1 text-slate-900">{content["label.Preview_Title"]}</h1>
            <p className="text-lead text-slate-500">{content["label.Preview_Intro"]}</p>
          </header>

          <section className="flex flex-col gap-16">
            <h2 className="text-large text-slate-900">{content["label.Preview_Desktop"]}</h2>
            <iframe
              title={content["label.Preview_Desktop"]}
              src={src}
              className="h-[800px] w-full rounded-md border border-slate-200"
            />
          </section>

          <section className="flex flex-col gap-16">
            <h2 className="text-large text-slate-900">{content["label.Preview_Mobile"]}</h2>
            <iframe
              title={content["label.Preview_Mobile"]}
              src={src}
              className="h-[844px] w-[390px] max-w-full rounded-md border border-slate-200"
            />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
