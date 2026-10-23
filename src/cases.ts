// Mock data for search and the design case pages. This is placeholder copy for
// the search feature, not site copy, so it lives here rather than in
// public/assets/content.json. Replace it with real case studies when they exist.
//
// Every case shares one image until there are real ones, so each entry points
// at the same tile the landing page uses.

export interface DesignCase {
  id: string;
  title: string;
  year: number;
  /** Short category labels, shown as tags on results and on the case page. */
  tags: string[];
  /** One-sentence summary, shown on the results page. */
  summary: string;
  role: string;
  challenge: string;
  approach: string;
  outcome: string;
}

export const CASE_IMAGE = "/assets/portfolio-tile.jpg";
export const CASE_IMAGE_ALT = "A lioness resting on open gravel";

export const CASES: DesignCase[] = [
  {
    id: "budgeting-app-onboarding",
    title: "Onboarding redesign for a budgeting app",
    year: 2025,
    tags: ["UX", "Mobile", "Fintech"],
    summary:
      "Reduced the number of steps to first budget from nine to four, using progressive disclosure and clearer permission requests.",
    role: "Lead UX and UI designer",
    challenge:
      "New users abandoned onboarding before linking their first account. Bank connection and permission requests appeared before users understood what the app would do for them.",
    approach:
      "Mapped the drop-off points with session recordings and five moderated interviews. Moved permission requests to the moment they are needed, and introduced a sample budget so users could see the result before connecting an account.",
    outcome:
      "First budget created within one session rose from 38% to 61% in an A/B test. Account linking was unchanged, which the team read as users connecting with more intent.",
  },
  {
    id: "clinic-appointment-booking",
    title: "Appointment booking for a clinic network",
    year: 2024,
    tags: ["UX", "Healthcare", "Research"],
    summary:
      "Research-led redesign of online booking for a multi-site clinic network, focused on finding the right appointment type first time.",
    role: "UX designer and researcher",
    challenge:
      "Patients often booked the wrong appointment type, and the front desk spent time rebooking them. The existing flow listed more than thirty types with little explanation.",
    approach:
      "Ran a card-sorting study with 40 patients and worked with clinicians to group appointment types by the question the patient is trying to answer. Added a short symptom-led entry point ahead of the full list.",
    outcome:
      "Wrong-type bookings fell by about a third in the first quarter after launch. The front desk reported fewer rebooking calls during the same period.",
  },
  {
    id: "design-system-rollout",
    title: "Design system rollout for a product team",
    year: 2024,
    tags: ["UI", "Design systems", "Product"],
    summary:
      "Built and rolled out a shared component library across three product teams, with tokens, documentation and a shared review process.",
    role: "Design system lead",
    challenge:
      "Three product teams had drifted into separate button, form and colour decisions. Every new feature needed the same components rebuilt, and the differences showed to customers.",
    approach:
      "Audited the existing screens, agreed a token set with engineering, and built the core components in Figma with matching code. Set up a fortnightly review so teams could propose changes without forking the library.",
    outcome:
      "Adopted by all three teams within six months. Hand-off questions in design reviews dropped noticeably, and the teams now ship from a single set of components.",
  },
  {
    id: "creative-tool-brand",
    title: "Brand and interface for a creative tool",
    year: 2023,
    tags: ["Visual design", "Brand", "UI"],
    summary:
      "Visual identity and interface direction for a start-up's browser-based creative tool, from first sketches to the launch screens.",
    role: "Visual and UI designer",
    challenge:
      "The product worked well for its early users but looked like a prototype. The brand needed to feel confident without competing with the work people made in the tool.",
    approach:
      "Developed three visual directions and tested them with creative professionals. Chose a restrained interface with neutral surfaces, so user artwork stood out, and a single accent colour for actions.",
    outcome:
      "The chosen direction launched with the public beta. The team used the same palette and type system for the marketing site and onboarding emails.",
  },
];

/**
 * Case-insensitive match on title, summary, tags and year. An empty or
 * whitespace-only query matches nothing, so the results page can show its
 * prompt instead of listing every case.
 *
 * Mockup behaviour: when nothing matches, every case is returned, so a search
 * always has results to show. Remove the fallback once real search exists.
 */
export function searchCases(query: string): DesignCase[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const matches = CASES.filter((item) => {
    const haystack = [item.title, item.summary, item.year.toString(), ...item.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
  return matches.length > 0 ? matches : CASES;
}

export function findCase(id: string): DesignCase | undefined {
  return CASES.find((item) => item.id === id);
}
