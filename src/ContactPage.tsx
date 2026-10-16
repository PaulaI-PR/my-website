import { useState, type FormEvent } from "react";
import { Button, Footer, Input, Label, Nav } from "pinx-ui";
import { MENU, useContent } from "./content";

// Figma: my-website › Contact — Desktop (node 114:692) and Contact — Mobile
// (114:768). Same page at two widths, so one component with md: as the seam:
// below md the contact details stack above the form, at md and up they sit
// side by side in two equal columns — the same frame as the About page.
//
// As on AboutPage, the frames' Inter / slate styling is mapped onto the nearest
// pinx-ui tokens rather than copied:
//
//   design                         token
//   h1 Inter SemiBold 48           display-l (Roboto Serif Bold 60)
//   intro, details Inter 14        body-s
//   slate/500 secondary text       text-body (body-disabled would fail 4.5:1)
//   slate/400 icon ring            border-border-dark
//   fields, Send message           pinx-ui Input and Button
//
// Spacing snaps to the scale, ties rounding up:
//
//   design    token   px    used for
//   2         4xs      2    detail label to value (exact)
//   8         2xs      8    title to intro (exact)
//   12        xs      12    "Follow me" to icons, icon gap (exact)
//   16        s       16    gutters, mobile top padding
//   20        m       24    gap between the two details
//   24        m       24    form field gap, desktop top padding (exact)
//   32        l       32    mobile contact-info gap (exact)
//   40        xl      48    desktop contact-info gap, mobile section gaps
//   48        xl      48    desktop gap above the footer (exact)
//   64        2xl     64    desktop column gap (exact)
//
// What pinx-ui does not have, and how it is covered here:
// - No Textarea. The message field is a native <textarea> with Input's own
//   border, radius, inset and type classes so it reads as the same control.
//   Its label is pinx-ui's Label at body-s; Input's built-in label is
//   14px Medium, so the Message label is one weight lighter than the two above.
// - No social/icon-button component, and no LinkedIn / Instagram / WhatsApp
//   icons. The ringed links are built here around the frame's own SVGs.
// - Button's only fills are primary/secondary; the frame's dark slate button
//   is left to the design system, as on AboutPage.
// - There is no backend for the form, so "sending" validates and then shows a
//   confirmation. Nothing leaves the browser.

// Placeholder hrefs: the design names the three networks but not the profiles.
// Swap in the real URLs.
const SOCIAL = [
  { name: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "#" },
  { name: "Instagram", icon: "/assets/icons/instagram.svg", href: "#" },
  { name: "WhatsApp", icon: "/assets/icons/whatsapp.svg", href: "#" },
];

// Same loose check as LoginPage: the client can only confirm the value looks
// like an address.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactPage() {
  const content = useContent();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  if (!content) return null;

  // Button renders a <button> with no type, so inside a form it is the submit
  // button: Enter in a field clicks it, its onClick sends, and the submit event
  // that follows is stopped here. As on LoginPage, this must do nothing else
  // or the send would run twice.
  function swallowSubmit(event: FormEvent) {
    event.preventDefault();
  }

  function send() {
    const next: FormErrors = {};
    if (!name.trim()) next.name = content!["error.Contact_Name"];
    if (!EMAIL_PATTERN.test(email.trim())) next.email = content!["error.Contact_Email"];
    if (!message.trim()) next.message = content!["error.Contact_Message"];
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSent(false);
  }

  const phone = content["label.Contact_Phone"];
  const address = content["label.Contact_Email"];

  return (
    <div className="min-h-screen bg-white font-body text-body">
      <Nav
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === "#/contact",
        }))}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-xl px-s pt-s md:pt-m">
        <main className="flex flex-col gap-xl md:flex-row md:items-start md:gap-2xl">
          <div className="flex flex-col gap-l md:flex-1 md:gap-xl">
            <header className="flex flex-col gap-2xs">
              <h1 className="font-display text-display-l text-body">
                {content["label.Contact_Title"]}
              </h1>
              <p className="text-body-s text-body">{content["label.Contact_Intro"]}</p>
            </header>

            <dl className="flex flex-col gap-m text-body-s text-body">
              <div className="flex flex-col gap-4xs">
                <dt>{content["label.Contact_PhoneLabel"]}</dt>
                <dd>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
                    {phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-4xs">
                <dt>{content["label.Contact_EmailLabel"]}</dt>
                <dd>
                  <a href={`mailto:${address}`} className="hover:underline">
                    {address}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-xs">
              <p className="text-body-s text-body">{content["label.Contact_Follow"]}</p>
              <ul className="flex items-center gap-xs">
                {SOCIAL.map((network) => (
                  <li key={network.name}>
                    <a
                      href={network.href}
                      aria-label={network.name}
                      className="flex size-11 items-center justify-center rounded-full border border-border-dark transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-700"
                    >
                      <img src={network.icon} alt="" width={24} height={24} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-1">
            {sent ? (
              <div className="flex flex-col gap-s" role="status">
                <h2 className="font-display text-display-s text-body">
                  {content["label.Contact_SentTitle"]}
                </h2>
                <p className="text-body-md text-body">{content["label.Contact_SentBody"]}</p>
                <div className="w-fit">
                  <Button
                    label={content["label.Contact_SendAnother"]}
                    variant="secondary"
                    onClick={reset}
                  />
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-m" onSubmit={swallowSubmit} noValidate>
                <Input
                  label={content["label.Contact_NameField"]}
                  value={name}
                  onChange={setName}
                  placeholder={content["label.Contact_NamePlaceholder"]}
                  error={errors.name}
                />
                <Input
                  label={content["label.Contact_EmailField"]}
                  value={email}
                  onChange={setEmail}
                  placeholder={content["label.Contact_EmailPlaceholder"]}
                  error={errors.email}
                />
                {/* Nesting the textarea in a <label> is what ties Label's
                    text to it — Label renders a plain span. */}
                <label className="flex flex-col gap-2xs text-body-s">
                  <Label label={content["label.Contact_MessageField"]} />
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={content["label.Contact_MessagePlaceholder"]}
                    aria-invalid={errors.message ? true : undefined}
                    className={`h-20 w-full resize-y rounded-sm border bg-white p-xs font-body text-body-md text-body placeholder:text-body focus:border-2 focus:outline-none ${
                      errors.message ? "border-error focus:border-error" : "border-body focus:border-primary"
                    }`}
                  />
                  {errors.message && (
                    <span className="font-body text-xs text-error">{errors.message}</span>
                  )}
                </label>
                {/* Full width on mobile (the flex column stretches it),
                    intrinsic width on desktop. */}
                <div className="flex flex-col md:w-fit">
                  <Button label={content["label.Contact_Send"]} onClick={send} />
                </div>
              </form>
            )}
          </div>
        </main>

        <Footer copyright="copyright 2026" tagline="UX · UI · Visual design" />
      </div>
    </div>
  );
}
