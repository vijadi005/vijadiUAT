import React from "react";
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
    page: 'membership'
  });
  return metadata;
}



const page = async ({ params }) => {
  await params;
  const location_slug = LOCATION_NAME || "vaughan";
  const memberData = await fetchPageData(location_slug, "membership");
  const heroImage = getPreferredImage(memberData);
  const introText =
    memberData?.metadescription ||
    stripHtml(memberData?.section1 || "") ||
    "Keep the fun going with Pixel Pulse Play membership options.";

  return (
    <main className="ppp-detail-page">
      <section className="ppp-detail-hero">
        <div className="aero-max-container ppp-detail-hero__inner">
          <div className="ppp-detail-hero__copy">
            <SectionHeading className="section-heading-white" mainHeading="true">
              <span>{memberData?.title || memberData?.desc || "Membership"}</span>
            </SectionHeading>
            {memberData?.metatitle && <h2>{memberData.metatitle}</h2>}
            <p>{introText}</p>
            <div className="ppp-detail-hero__actions">
              <BookingButton title="Book Now" />
              <Link href="/contactus" className="ppp-detail-btn ppp-detail-btn--outline" prefetch>
                Inquire
              </Link>
            </div>
          </div>

          <div className="ppp-detail-hero__media">
            <img src={heroImage} alt={memberData?.imagetitle || "Pixel Pulse Play membership"} />
          </div>
        </div>
      </section>

      <section className="ppp-detail-body">
        <section className="aero-max-container ppp-detail-body__inner">
          <article
            className="ppp-detail-richtext"
            dangerouslySetInnerHTML={{ __html: memberData?.section1 || memberData?.seosection || "" }}
          />
        </section>
      </section>
    </main>
  );
};

export default page;
