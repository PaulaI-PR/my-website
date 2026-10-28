import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AboutPage } from "./AboutPage";
import { CasePage } from "./CasePage";
import { ContactPage } from "./ContactPage";
import { LandingPage } from "./LandingPage";
import { LoginPage } from "./LoginPage";
import { SearchPage } from "./SearchPage";
import { SearchPreviewPage } from "./SearchPreviewPage";
import "./styles.css";

// The site is two pages now, so it needs some way to pick between them. This is
// a hash router rather than a real one: the project has no routing dependency
// and this adds none, and the hash is the only thing that works on a static
// build with no server rewrites behind it.
//
// The cost is what a hash route always costs — the path is #/login rather than
// /login, and it is invisible to crawlers. If the site grows past a handful of
// pages, or ever wants real URLs, this is the seam to replace with a router.
//
// Search adds a query string to the hash (#/search?q=term), so the route is
// split into path and query before matching. The case pages are one route with
// an id after the prefix (#/case/<id>).

const LOGIN_ROUTE = "#/login";
const ABOUT_ROUTE = "#/about";
const CONTACT_ROUTE = "#/contact";
const SEARCH_ROUTE = "#/search";
const SEARCH_PREVIEW_ROUTE = "#/search-preview";
const CASE_ROUTE_PREFIX = "#/case/";

function useHashRoute(): string {
  // Read straight from location on first render so a deep link lands on the
  // right page immediately, rather than painting the landing page first.
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", onHashChange);
    // The hash can have changed between the initial render and this effect
    // running, so re-read once rather than trusting the first value.
    onHashChange();
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return hash;
}

function App() {
  const hash = useHashRoute();
  const queryAt = hash.indexOf("?");
  const path = queryAt === -1 ? hash : hash.slice(0, queryAt);
  const params = new URLSearchParams(queryAt === -1 ? "" : hash.slice(queryAt + 1));

  // Anything that is not a known route is the landing page,
  // including the bare "#" the placeholder nav links set.
  if (path === LOGIN_ROUTE) return <LoginPage />;
  if (path === ABOUT_ROUTE) return <AboutPage />;
  if (path === CONTACT_ROUTE) return <ContactPage />;
  if (path === SEARCH_ROUTE) return <SearchPage query={params.get("q") ?? ""} />;
  if (path === SEARCH_PREVIEW_ROUTE) return <SearchPreviewPage />;
  if (path.startsWith(CASE_ROUTE_PREFIX)) {
    return <CasePage id={path.slice(CASE_ROUTE_PREFIX.length)} />;
  }
  return <LandingPage />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
