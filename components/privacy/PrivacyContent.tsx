import { privacySections, type PrivacySection } from "@/lib/privacy";

/** Renders plain text with optional **bold** markers (API-friendly). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-charcoal">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function PolicyHeading({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-l from-gold to-gold-dark text-sm font-bold text-charcoal">
        {index}
      </span>
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-charcoal md:text-xl">
        {title}
      </h2>
    </div>
  );
}

function CalloutBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 rounded-xl border-l-4 border-gold bg-[#faf6ef] px-5 py-4">
      <p className="text-sm font-semibold text-gold-dark">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#4a4a4a]">
        <RichText text={body} />
      </p>
    </div>
  );
}

function SectionBlock({ section, index }: { section: PrivacySection; index: number }) {
  return (
    <section id={section.id} className="scroll-mt-28 border-b border-border pb-10 last:border-b-0 last:pb-0">
      <PolicyHeading index={index} title={section.title} />

      <div className="mt-4 space-y-4 pl-0 md:pl-10">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="text-[15px] leading-relaxed text-[#4a4a4a]">
            <RichText text={paragraph} />
          </p>
        ))}

        {section.bullets?.length ? (
          <ul className="list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-[#4a4a4a]">
            {section.bullets.map((bullet) => (
              <li key={`${bullet.label ?? ""}${bullet.text.slice(0, 32)}`}>
                {bullet.label ? <strong className="text-charcoal">{bullet.label}: </strong> : null}
                <RichText text={bullet.text} />
              </li>
            ))}
          </ul>
        ) : null}

        {section.closingParagraphs?.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="text-[15px] leading-relaxed text-[#4a4a4a]">
            <RichText text={paragraph} />
          </p>
        ))}

        {section.callout ? (
          <CalloutBox title={section.callout.title} body={section.callout.body} />
        ) : null}

        {section.contactBox ? (
          <div className="mt-5 rounded-xl border-l-4 border-gold bg-[#faf6ef] px-5 py-5">
            <p className="text-sm font-semibold text-gold-dark">{section.contactBox.title}</p>
            <ul className="mt-3 space-y-2.5 text-[15px] text-[#4a4a4a]">
              {section.contactBox.items.map((item) => (
                <li key={item.label} className="flex flex-wrap gap-x-2">
                  <span className="font-semibold text-gold-dark">{item.label}:</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function PrivacyContent() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <div className="space-y-10">
        {privacySections.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

export { privacySections };
