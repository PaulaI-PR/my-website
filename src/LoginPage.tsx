import { useEffect, useState, type FormEvent } from "react";
import { Button, Input, Navigation, RadioButton } from "@pikonen/second-design-system";
import { MENU, useContent } from "./content";
import { requestCode, verifyCode, type Channel } from "./otp";

// Passwordless login. Two steps, one page: pick how the one-time code should
// arrive (email or SMS) and give the address it should go to, then type the code
// back in. A third step confirms.
//
// There is no Figma frame for this page — it is built from the design system's
// own components and tokens rather than from a design, so the layout is plain:
// one narrow column, everything stacked, under the same Navigation as every
// other page. Colours and spacing are the package's tokens; type is the Figma
// text styles in styles.css.
//
// Two things the design system does not cover, worked around rather than
// invented over: Input has no error state (see `field-error` in styles.css),
// and there is no Label, so the radio group's legend is styled to match
// Input's own label (Inter Medium 14 / 20, slate-900).

// Deliberately loose. The only thing a client can usefully check is that the
// value has the shape of an address at all; whether it exists, and whether it
// is the user's, is the server's business and the code's.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{7,15}$/;
const CODE_PATTERN = /^\d{6}$/;

// Phone numbers get written with spaces, dashes and brackets in them, and all
// three are noise. Strip before testing, and send the stripped form.
function normalisePhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

// Seconds before "send a new code" is offered again. A cooldown is the client's
// half of not letting someone spam a stranger's inbox; the server has to hold
// the other half, since nothing here stops a scripted caller.
const RESEND_COOLDOWN_S = 30;

type Step = "request" | "verify" | "done";

export function LoginPage() {
  const content = useContent();

  const [step, setStep] = useState<Step>("request");
  const [channel, setChannel] = useState<Channel>("email");

  // Kept apart rather than as one `destination`, so switching channel back and
  // forth does not throw away what was already typed into the other field.
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  // Where the code actually went, captured at send time. Reading `email`/`phone`
  // in step 2 would let the confirmation line drift if the field were edited.
  const [sentTo, setSentTo] = useState("");

  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // One timeout per remaining second: the effect re-runs on each decrement and
  // stops itself at zero. Cheap, and it cancels cleanly on unmount.
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = window.setTimeout(() => {
      setCooldown((remaining) => remaining - 1);
    }, 1000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [cooldown]);

  if (!content) return null;

  const isEmail = channel === "email";
  const destination = isEmail ? email : normalisePhone(phone);

  function validateDestination(): string | null {
    if (isEmail) {
      return EMAIL_PATTERN.test(email) ? null : content!["error.Login_Email"];
    }
    return PHONE_PATTERN.test(normalisePhone(phone))
      ? null
      : content!["error.Login_Phone"];
  }

  async function send() {
    const problem = validateDestination();
    setDestinationError(problem);
    if (problem) return;

    setPending(true);
    try {
      await requestCode(channel, destination);
      setSentTo(destination);
      setCode("");
      setCodeError(null);
      setCooldown(RESEND_COOLDOWN_S);
      setStep("verify");
    } catch (error: unknown) {
      console.error("Could not request a one-time code", error);
      setDestinationError(content!["error.Login_SendFailed"]);
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    setPending(true);
    try {
      await requestCode(channel, sentTo);
      setCode("");
      setCodeError(null);
      setCooldown(RESEND_COOLDOWN_S);
    } catch (error: unknown) {
      console.error("Could not request a one-time code", error);
      setCodeError(content!["error.Login_SendFailed"]);
    } finally {
      setPending(false);
    }
  }

  async function verify() {
    if (!CODE_PATTERN.test(code)) {
      setCodeError(content!["error.Login_Code"]);
      return;
    }

    setPending(true);
    try {
      const ok = await verifyCode(code);
      if (ok) {
        setStep("done");
      } else {
        setCodeError(content!["error.Login_CodeWrong"]);
      }
    } catch (error: unknown) {
      console.error("Could not verify the one-time code", error);
      setCodeError(content!["error.Login_SendFailed"]);
    } finally {
      setPending(false);
    }
  }

  function restart() {
    setStep("request");
    setCode("");
    setCodeError(null);
    setDestinationError(null);
    setCooldown(0);
  }

  // Each step is a real form with a real submit button, so Enter in a field
  // submits it. preventDefault keeps the page from reloading.
  function onSubmit(action: () => void) {
    return (event: FormEvent) => {
      event.preventDefault();
      action();
    };
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navigation
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === "#/login",
        }))}
      />

      <main className="mx-auto flex w-full max-w-sm flex-col gap-32 px-16 py-48 md:px-0">
        <header className="flex flex-col gap-8">
          <h1 className="text-h1 text-slate-900">
            {step === "done"
              ? content["label.Login_DoneTitle"]
              : content["label.Login_Title"]}
          </h1>
          <p className="text-p text-slate-500">
            {step === "done"
              ? content["label.Login_DoneBody"]
              : content["label.Login_Intro"]}
          </p>
        </header>

        {step === "request" && (
          <form className="flex flex-col gap-24" onSubmit={onSubmit(() => void send())}>
            {/* A fieldset for the group and a legend for its name, which is
                what makes a screen reader announce "How should we send your
                code?" before each option. RadioButton carries its own <label>,
                so each option needs no wrapper. */}
            <fieldset className="flex flex-col gap-12">
              <legend className="mb-12 text-small leading-[20px] text-slate-900">
                {content["label.Login_ChannelLegend"]}
              </legend>
              <RadioButton
                name="otp-channel"
                value="email"
                checked={isEmail}
                onChange={() => {
                  setChannel("email");
                  setDestinationError(null);
                }}
                label={content["label.Login_ChannelEmail"]}
                disabled={pending}
              />
              <RadioButton
                name="otp-channel"
                value="sms"
                checked={!isEmail}
                onChange={() => {
                  setChannel("sms");
                  setDestinationError(null);
                }}
                label={content["label.Login_ChannelSms"]}
                disabled={pending}
              />
            </fieldset>

            {/* One field, re-labelled by channel, rather than two that swap —
                the value behind it swaps, but the control does not, so focus and
                the field's position on the page stay put. Its type follows the
                channel, so mobile shows the matching keyboard and the browser
                offers the matching autofill. */}
            <Input
              type={isEmail ? "email" : "tel"}
              autoComplete={isEmail ? "email" : "tel"}
              label={
                isEmail
                  ? content["label.Login_EmailLabel"]
                  : content["label.Login_PhoneLabel"]
              }
              value={isEmail ? email : phone}
              onChange={(event) => {
                if (isEmail) setEmail(event.target.value);
                else setPhone(event.target.value);
                setDestinationError(null);
              }}
              placeholder={
                isEmail
                  ? content["label.Login_EmailPlaceholder"]
                  : content["label.Login_PhonePlaceholder"]
              }
              helperText={destinationError ?? undefined}
              aria-invalid={destinationError ? true : undefined}
              className={destinationError ? "field-error" : undefined}
              disabled={pending}
            />

            <Button type="submit" className="w-fit" loading={pending}>
              {content["label.Login_Send"]}
            </Button>
          </form>
        )}

        {step === "verify" && (
          <form className="flex flex-col gap-24" onSubmit={onSubmit(() => void verify())}>
            <p className="text-p text-slate-800">
              {content["label.Login_CodeSent"].replace("{destination}", sentTo)}
            </p>

            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              label={content["label.Login_CodeLabel"]}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setCodeError(null);
              }}
              placeholder={content["label.Login_CodePlaceholder"]}
              helperText={codeError ?? undefined}
              aria-invalid={codeError ? true : undefined}
              className={codeError ? "field-error" : undefined}
              disabled={pending}
            />

            {/* All three actions of this step are one group: one wrapper, one
                gap token, one alignment. Button has no size prop, so all three
                are the same size by construction; only the variant marks the
                primary action. */}
            <div className="flex flex-wrap items-center gap-16">
              <Button type="submit" loading={pending}>
                {content["label.Login_Verify"]}
              </Button>
              {/* The cooling-down state is a second copy string with a
                  {seconds} placeholder rather than a number glued onto the
                  first one, so a translator can put the count where their
                  language wants it. */}
              <Button
                variant="outline"
                onClick={() => void resend()}
                disabled={pending || cooldown > 0}
              >
                {cooldown > 0
                  ? content["label.Login_ResendWait"].replace("{seconds}", String(cooldown))
                  : content["label.Login_Resend"]}
              </Button>
              <Button variant="outline" onClick={restart} disabled={pending}>
                {content["label.Login_Back"]}
              </Button>
            </div>
          </form>
        )}

        {step === "done" && (
          <Button variant="outline" className="w-fit" onClick={restart}>
            {content["label.Login_Restart"]}
          </Button>
        )}
      </main>
    </div>
  );
}
