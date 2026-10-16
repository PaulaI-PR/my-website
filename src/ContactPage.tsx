import { useState, type FormEvent } from "react";
import { Button, Footer, Input, Navigation, Textarea } from "@pikonen/second-design-system";
import { MENU, useContent } from "./content";

// Figma: my-website › Contact — Desktop (node 114:692) and Contact — Mobile
// (114:768). Same page at two widths, so one component with md: as the seam:
// below md the contact details stack above the form, at md and up they sit
// side by side in two equal columns — the same frame as the About page.
//
// Colours and spacing are the package's tokens and type is the Figma text
// styles, all at the frame's own values. One exception: the detail label sits
// 2px above its value in Figma, and the spacing scale has no 2px step, so it
// rounds up to 4.
//
// Where the design system falls short, and how it is covered here:
// - No error state on Input or Textarea. Errors go in helperText, which the
//   component already links to the field with aria-describedby, and the field
//   is marked aria-invalid. The helper text is slate in the package, so the
//   `field-error` class (styles.css) recolours it — by reaching into the
//   component's own class names, which is fragile and is what an `error` prop
//   upstream should replace.
// - Button renders a <button> only, with no way to render a link. The social
//   links are anchors carrying Button's own icon-circle classes, so they look
//   and behave exactly like the component; Button just cannot be one. That
//   circle is 40px, against the frame's 44px — the component wins.
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

  function send(event: FormEvent) {
    event.preventDefault();
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
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navigation
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === "#/contact",
        }))}
      />

      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-40 px-16 pt-16 pb-40 md:flex-row md:items-start md:gap-64 md:pt-24 md:pb-48">
          <div className="flex flex-col gap-32 md:flex-1 md:gap-40">
            <header className="flex flex-col gap-8">
              <h1 className="text-h1 text-slate-900">{content["label.Contact_Title"]}</h1>
              <p className="text-body text-slate-500">{content["label.Contact_Intro"]}</p>
            </header>

            <dl className="flex flex-col gap-20 text-body">
              <div className="flex flex-col gap-4">
                <dt className="text-slate-500">{content["label.Contact_PhoneLabel"]}</dt>
                <dd className="text-slate-900">
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
                    {phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-4">
                <dt className="text-slate-500">{content["label.Contact_EmailLabel"]}</dt>
                <dd className="text-slate-900">
                  <a href={`mailto:${address}`} className="hover:underline">
                    {address}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-12">
              <p className="text-body text-slate-500">{content["label.Contact_Follow"]}</p>
              <ul className="flex items-center gap-12">
                {SOCIAL.map((network) => (
                  <li key={network.name}>
                    <a
                      href={network.href}
                      aria-label={network.name}
                      className="ds-button ds-button--default ds-button--icon-circle"
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
              <div className="flex flex-col gap-16" role="status">
                <h2 className="text-large text-slate-900">{content["label.Contact_SentTitle"]}</h2>
                <p className="text-p text-slate-800">{content["label.Contact_SentBody"]}</p>
                <Button variant="outline" className="w-fit" onClick={reset}>
                  {content["label.Contact_SendAnother"]}
                </Button>
              </div>
            ) : (
              <form className="flex flex-col gap-24" onSubmit={send} noValidate>
                <Input
                  label={content["label.Contact_NameField"]}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={content["label.Contact_NamePlaceholder"]}
                  autoComplete="name"
                  helperText={errors.name}
                  aria-invalid={errors.name ? true : undefined}
                  className={errors.name ? "field-error" : undefined}
                />
                <Input
                  type="email"
                  label={content["label.Contact_EmailField"]}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={content["label.Contact_EmailPlaceholder"]}
                  autoComplete="email"
                  helperText={errors.email}
                  aria-invalid={errors.email ? true : undefined}
                  className={errors.email ? "field-error" : undefined}
                />
                <Textarea
                  label={content["label.Contact_MessageField"]}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={content["label.Contact_MessagePlaceholder"]}
                  helperText={errors.message}
                  aria-invalid={errors.message ? true : undefined}
                  className={errors.message ? "field-error" : undefined}
                />
                {/* Full width on mobile, intrinsic width on desktop, as in the
                    frames. */}
                <Button type="submit" className="w-full md:w-fit">
                  {content["label.Contact_Send"]}
                </Button>
              </form>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
