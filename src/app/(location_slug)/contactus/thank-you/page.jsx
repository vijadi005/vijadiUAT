import Link from "next/link";
import "../../../styles/contactus.css";
import { fetchsheetdata } from "@/lib/sheets";
import { LOCATION_NAME } from "@/lib/constant";
import { getCtaContent } from "@/lib/ctaContent";
import ContactSubmittedEmail from "@/components/smallComponents/ContactSubmittedEmail";

export const metadata = {
  title: "Thank You | Pixel Pulse Play",
  description: "Thanks for submitting the Pixel Pulse Play contact form.",
};

export default async function ContactThankYouPage() {
  const configData = await fetchsheetdata("config", LOCATION_NAME);
  const ctaContent = getCtaContent(configData);
  const pricingHref = ctaContent.pricingHref || "/pricing-promos";

  return (
    <main className="ppp-contact-page">
      <section className="ppp-contact-thanks">
        <div className="aero-max-container">
          <article className="ppp-contact-thanks__card">
            <span className="ppp-contact-thanks__eyebrow">Inquiry received</span>
            <div className="ppp-contact-thanks__icon" aria-hidden="true">
              ✓
            </div>
            <h1 className="ppp-contact-thanks__title">
              Thanks for reaching out.
            </h1>
            <ContactSubmittedEmail />
            <div className="ppp-contact-thanks__steps" aria-label="What happens next">
              <div>
                <strong>1</strong>
                <span>We review your details</span>
              </div>
              <div>
                <strong>2</strong>
                <span>We match the right visit plan</span>
              </div>
              <div>
                <strong>3</strong>
                <span>You get the next steps</span>
              </div>
            </div>
            <div className="ppp-contact-thanks__actions">
              {ctaContent.backHomeText && (
                <Link href="/" className="submit-button">
                  {ctaContent.backHomeText}
                </Link>
              )}
              {ctaContent.pricingText && (
                <Link href={pricingHref} className="ppp-contact-thanks__link ppp-contact-thanks__link--highlight">
                  {ctaContent.pricingText}
                </Link>
              )}
              {ctaContent.sendAnotherText && (
                <Link href="/contactus" className="ppp-contact-thanks__link">
                  {ctaContent.sendAnotherText}
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
