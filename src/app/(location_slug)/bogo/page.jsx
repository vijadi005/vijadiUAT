import React from "react";
import "../../styles/kidsparty.css";
import "../../styles/subcategory.css";
import Link from "next/link";
import { fetchPageData, generateMetadataLib } from "@/lib/sheets";
import { LOCATION_NAME } from "@/lib/constant";
import SectionHeading from "@/components/home/SectionHeading";
import BookingButton from "@/components/smallComponents/BookingButton";

function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPreferredImage(pageData) {
  return pageData?.smallimage || pageData?.headerimage || "/assets/images/logo.png";
}

export async function generateMetadata({ params }) {
  await params;
  const metadata = await generateMetadataLib({
    location: LOCATION_NAME || "vaughan",
    category: '',
    page: 'bogo'
  });
  return metadata;
}

const page = async ({ params }) => {
  await params;
  const location_slug = LOCATION_NAME || "vaughan";
  const pageData = await fetchPageData(location_slug, "bogo");
  const heroImage = getPreferredImage(pageData);
  const introText =
    pageData?.metadescription ||
    stripHtml(pageData?.section1 || "") ||
    "Grab the latest Pixel Pulse Play offer before your next visit.";
  
  return (
    <main className="ppp-detail-page">
      <section className="ppp-detail-hero">
        <div className="aero-max-container ppp-detail-hero__inner">
          <div className="ppp-detail-hero__copy">
            <SectionHeading className="section-heading-white" mainHeading="true">
              <span>{pageData?.title || pageData?.desc || "BOGO"}</span>
            </SectionHeading>
            {pageData?.metatitle && <h2>{pageData.metatitle}</h2>}
            <p>{introText}</p>
            <div className="ppp-detail-hero__actions">
              <BookingButton title="Book Now" />
              <Link href="/contactus" className="ppp-detail-btn ppp-detail-btn--outline" prefetch>
                Inquire
              </Link>
            </div>
          </div>

          <div className="ppp-detail-hero__media">
            <img src={heroImage} alt={pageData?.imagetitle || "Pixel Pulse Play promotion"} />
          </div>
        </div>
      </section>

      <section className="ppp-detail-body">
        <section className="aero-max-container ppp-detail-body__inner">
          <article
            className="ppp-detail-richtext"
            dangerouslySetInnerHTML={{ __html: pageData?.section1 || pageData?.seosection || "" }}
          />
        </section>
      </section>
    </main>
  );
};

export default page;
