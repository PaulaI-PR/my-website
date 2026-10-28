// The site's user-facing copy lives in public/assets/content.json, not in the
// page files, so it can be edited and reloaded without a rebuild. The cost of
// that: it is fetched rather than bundled, so it arrives after first paint and
// a page has nothing to render until it lands.
//
// Keys are the content file's own, dotted and verbatim. Listing them as a union
// rather than reaching into a Record<string, string> is what makes a typo at a
// call site a type error instead of an "undefined" on the page.
//
// This module exists because there are now two pages sharing one content file —
// the fetch, the key union and the loading rule all live here rather than being
// restated per page.

import { useEffect, useState } from "react";

const CONTENT_URL = "/assets/content.json";

export type ContentKey =
  // Header — the site name and the nav links, shown on every page.
  | "label.SiteName"
  | "label.Navi_1"
  | "label.Navi_2"
  | "label.Navi_3"
  | "label.Navi_Login"
  // About page.
  | "label.About_Title"
  | "label.About_Quote"
  | "label.About_Lead"
  | "label.About_Body_1"
  | "label.About_Body_2"
  | "label.About_PortraitPlaceholder"
  | "label.About_DownloadCv"
  // Contact page: details, the message form and its sent state.
  | "label.Contact_Title"
  | "label.Contact_Intro"
  | "label.Contact_PhoneLabel"
  | "label.Contact_Phone"
  | "label.Contact_EmailLabel"
  | "label.Contact_Email"
  | "label.Contact_Follow"
  | "label.Contact_NameField"
  | "label.Contact_NamePlaceholder"
  | "label.Contact_EmailField"
  | "label.Contact_EmailPlaceholder"
  | "label.Contact_MessageField"
  | "label.Contact_MessagePlaceholder"
  | "label.Contact_Send"
  | "label.Contact_SentTitle"
  | "label.Contact_SentBody"
  | "label.Contact_SendAnother"
  | "error.Contact_Name"
  | "error.Contact_Email"
  | "error.Contact_Message"
  // Login page, step 1: pick a channel and give the destination for the code.
  | "label.Login_Title"
  | "label.Login_Intro"
  | "label.Login_ChannelLegend"
  | "label.Login_ChannelEmail"
  | "label.Login_ChannelSms"
  | "label.Login_EmailLabel"
  | "label.Login_EmailPlaceholder"
  | "label.Login_PhoneLabel"
  | "label.Login_PhonePlaceholder"
  | "label.Login_Send"
  // Login page, step 2: enter the code that was sent.
  // Login_CodeSent and Login_ResendWait carry a {destination} / {seconds}
  // placeholder, filled at render time.
  | "label.Login_CodeSent"
  | "label.Login_CodeLabel"
  | "label.Login_CodePlaceholder"
  | "label.Login_Verify"
  | "label.Login_Resend"
  | "label.Login_ResendWait"
  | "label.Login_Back"
  // Login page, step 3: confirmation.
  | "label.Login_DoneTitle"
  | "label.Login_DoneBody"
  | "label.Login_Restart"
  // Login page validation and failure messages.
  | "error.Login_Email"
  | "error.Login_Phone"
  | "error.Login_Code"
  | "error.Login_CodeWrong"
  | "error.Login_SendFailed"
  // Search: the modal opened from the header, and the results and case pages it
  // leads to. Results_Summary carries {count} and {query}; the query placeholder
  // is filled at render time.
  | "label.Search_Open"
  | "label.Search_Title"
  | "label.Search_Close"
  | "label.Search_Field"
  | "label.Search_Placeholder"
  | "label.Search_Submit"
  | "error.Search_Empty"
  | "label.Results_Title"
  | "label.Results_Prompt"
  | "label.Results_Summary"
  | "label.Results_SummarySingle"
  | "label.Results_ViewCase"
  | "label.Case_Back"
  | "label.Case_Role"
  | "label.Case_Year"
  | "label.Case_Challenge"
  | "label.Case_Approach"
  | "label.Case_Outcome"
  | "label.Case_NotFound"
  // Search preview: a page of the live search at desktop and mobile widths.
  | "label.Preview_Title"
  | "label.Preview_Intro"
  | "label.Preview_Desktop"
  | "label.Preview_Mobile";

export type Content = Record<ContentKey, string>;

/**
 * Loads the content file once per mount. Returns null until it lands — pages
 * are expected to render nothing at all rather than paint themselves with
 * holes in them. If the fetch fails this stays null by design and the error is
 * on the console.
 */
export function useContent(): Content | null {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    // StrictMode runs this twice in dev, so the second response can land first;
    // the flag drops whichever result belongs to the torn-down effect.
    let cancelled = false;

    fetch(CONTENT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${CONTENT_URL} responded ${response.status}`);
        }
        // Unchecked: the file is ours and ships alongside the page, so a missing
        // key is a build-time mistake to catch in review, not a runtime branch.
        return response.json() as Promise<Content>;
      })
      .then((loaded) => {
        if (!cancelled) setContent(loaded);
      })
      .catch((error: unknown) => {
        console.error("Could not load site content", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}

// Labels come from the content file; hrefs are routing, so they stay in code.
// Nav wants { label, href }, so the key is resolved to its copy at render time.
// Work is still the placeholder "#" it has always been; About and Contact are
// the real destinations, and they are what the hash router in index.tsx
// matches on.
//
// Log in is deliberately not listed: the page and its #/login route still
// exist, but the nav hides the link until login is ready to launch. Re-add
// { key: "label.Navi_Login", href: "#/login" } here to show it again.
export const MENU: { key: ContentKey; href: string }[] = [
  { key: "label.Navi_1", href: "#" },
  { key: "label.Navi_2", href: "#/about" },
  { key: "label.Navi_3", href: "#/contact" },
];
