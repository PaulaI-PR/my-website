import { Footer, ImageCard, Tag } from "@pikonen/second-design-system";
import { CASE_IMAGE, CASE_IMAGE_ALT, searchCases } from "./cases";
import { useContent } from "./content";
import { SiteHeader } from "./SiteHeader";

// The page the search modal leads to: #/search?q=<term>. Results are mock data
// from cases.ts, matched on the case's title, summary, tags and year. Each
// result links to its design case page at #/case/<id>.
//
// Layout follows the About and Contact pages: the 960px content column, and
// md: as the only seam — below md each result stacks its image above its text,
// at md and up the image sits to the left.

interface SearchPageProps {
  query: string;
}

export function SearchPage({ query }: SearchPageProps) {
  const content = useContent();

  if (!content) return null;

  const term = query.trim();
  const results = searchCases(term);

  // Results_Summary and Results_SummarySingle are the same sentence, split only
  // so "1 result" does not read "1 results".
  const summary = (results.length === 1
    ? content["label.Results_SummarySingle"]
    : content["label.Results_Summary"]
  )
    .replace("{count}", String(results.length))
    .replace("{query}", term);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteHeader content={content} />

      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-32 px-16 pt-16 pb-40 md:pt-24 md:pb-48">
          <header className="flex flex-col gap-8">
            <h1 className="text-h1 text-slate-900">{content["label.Results_Title"]}</h1>
            {results.length > 0 && (
              <p className="text-lead text-slate-500" role="status">
                {summary}
              </p>
            )}
          </header>

          {!term && <p className="text-p text-slate-800">{content["label.Results_Prompt"]}</p>}

          {term && results.length === 0 && (
            <p className="text-p text-slate-800" role="status">
              {content["label.Results_Empty"].replace("{query}", term)}
            </p>
          )}

          {results.length > 0 && (
            <ul className="flex flex-col gap-32">
              {results.map((item) => (
                <li key={item.id} className="flex flex-col gap-16 md:flex-row md:gap-32">
                  {/* ImageCard's hover caption would otherwise show the component's
                      "Image Title" default, so the case's own title and tags go
                      in it. The title link beside the image is the way in. */}
                  <ImageCard
                    src={CASE_IMAGE}
                    alt={CASE_IMAGE_ALT}
                    title={item.title}
                    description={item.tags.join(" · ")}
                    className="aspect-[540/418] w-full md:aspect-[4/3] md:w-[280px] md:shrink-0"
                  />

                  <div className="flex flex-1 flex-col gap-12">
                    <div className="flex flex-wrap gap-8">
                      {item.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <h2 className="text-large text-slate-900">
                      <a href={`#/case/${item.id}`} className="hover:underline">
                        {item.title}
                      </a>
                    </h2>
                    <p className="text-p text-slate-800">{item.summary}</p>
                    <p className="text-body text-slate-500">{item.year}</p>
                    <a
                      href={`#/case/${item.id}`}
                      className="w-fit text-body-medium text-slate-900 underline underline-offset-4 hover:text-slate-500"
                    >
                      {content["label.Results_ViewCase"]}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
