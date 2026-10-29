import { Footer, ImageCard, Tag } from "@pikonen/second-design-system";
import { CASE_IMAGE, CASE_IMAGE_ALT, findCase } from "./cases";
import { useContent } from "./content";
import { SiteHeader } from "./SiteHeader";

// A design case study: #/case/<id>. The copy is mock data from cases.ts. The
// page is one template for every case, so a case added to that list needs no
// new page.
//
// Same column and seam as the other pages: the 960px content column, with md:
// as the only breakpoint. The hero is the design system's ImageCard, sized by
// its className, with the same placeholder photo as the landing page.

interface CasePageProps {
  id: string;
}

export function CasePage({ id }: CasePageProps) {
  const content = useContent();

  if (!content) return null;

  const item = findCase(id);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {/* Work is the menu item this page sits under. */}
      <SiteHeader content={content} activeHref="#" />

      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-32 px-16 pt-16 pb-40 md:pt-24 md:pb-48">
          <a href="#/search" className="w-fit text-body-medium text-slate-500 hover:text-slate-900">
            {content["label.Case_Back"]}
          </a>

          {!item && <h1 className="text-h1 text-slate-900">{content["label.Case_NotFound"]}</h1>}

          {item && (
            <>
              <header className="flex flex-col gap-16">
                <div className="flex flex-wrap gap-8">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <h1 className="text-h1 text-slate-900">{item.title}</h1>
                <p className="text-lead text-slate-500">{item.summary}</p>
                <dl className="flex flex-wrap gap-x-32 gap-y-16 text-body">
                  <div className="flex flex-col gap-4">
                    <dt className="text-slate-500">{content["label.Case_Role"]}</dt>
                    <dd className="text-slate-900">{item.role}</dd>
                  </div>
                  <div className="flex flex-col gap-4">
                    <dt className="text-slate-500">{content["label.Case_Year"]}</dt>
                    <dd className="text-slate-900">{item.year}</dd>
                  </div>
                </dl>
              </header>

              <ImageCard
                src={CASE_IMAGE}
                alt={CASE_IMAGE_ALT}
                title={item.title}
                className="aspect-[540/418] w-full md:aspect-[16/9]"
              />

              <div className="flex flex-col gap-32 md:gap-32">
                <section className="flex flex-col gap-12">
                  <h2 className="text-large text-slate-900">{content["label.Case_Challenge"]}</h2>
                  <p className="text-p text-slate-800">{item.challenge}</p>
                </section>
                <section className="flex flex-col gap-12">
                  <h2 className="text-large text-slate-900">{content["label.Case_Approach"]}</h2>
                  <p className="text-p text-slate-800">{item.approach}</p>
                </section>
                <section className="flex flex-col gap-12">
                  <h2 className="text-large text-slate-900">{content["label.Case_Outcome"]}</h2>
                  <p className="text-p text-slate-800">{item.outcome}</p>
                </section>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
