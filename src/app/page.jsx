import "./styles/home.css";
import "./styles/pagenew.css";
import "./styles/promotions.css";
import Image from "next/image";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import Countup from "@/components/Countup";
import MotionImage from "@/components/MotionImage";
import BlogCard from "@/components/smallComponents/BlogCard";
import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  generateMetadataLib,
} from "@/lib/sheets";
import { LOCATION_NAME } from "./lib/constant";
import PixelPulseSection from "./components/home/PixelPulseSection";
import CelebrateEventsSection from "./components/home/CelebrateEventsSection";
import SectionHeading from "./components/home/SectionHeading";
import BookingButton from "./components/smallComponents/BookingButton";

export async function generateMetadata() {
  const location_slug = LOCATION_NAME || "vaughan";
  try {
    const metadata = await generateMetadataLib({
      location: location_slug,
      category: "",
      page: "",
    });
    return metadata;
  } catch (error) {
    console.error("home metadata failed:", error);
    return {
      title: "Pixel Pulse Play Vaughan",
      description: "Indoor arcade games, challenge rooms, and family fun in Vaughan.",
    };
  }
}

/* ─── JSON-LD schema updated for Vaughan ─── */
const pixelPulseSchema = {
  "@context": "https://schema.org",
  "@type": "AmusementPark",
  name: "Pixel Pulse Play Vaughan",
  description:
    "Indoor game rooms in Vaughan with laser mazes, tile challenges, climbing, sports games, birthday parties, and group bookings.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vaughan",
    addressRegion: "ON",
    addressCountry: "Canada",
  },
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "5000",
  },
  sameAs: [
    "https://www.facebook.com/pixelpulseplay",
    "https://www.instagram.com/pixelpulseplay",
  ],
};

/* ─── Stat bar data ─── */
const STATS = [
  { num: 8,    label: "Game Rooms" },
  { num: 5000, label: "Visits Booked" },
  { num: 4,    label: "Party Rooms" },
  { num: 1,    label: "Vaughan Location" },
];

/* ─── Pricing tiers ─── */
const PRICING = [
  {
    tier: "Starter",
    name: "Explorer Pass (30 Min)",
    price: 19,
    unit: "per player",
    tag: null,
    features: [
      "Access to game zones",
      "30-minute session",
      
    ],
    cta: "Book Explorer",
    href: "/programs",
  },
  {
    tier: "Best Value",
    name: "All-Access Pass (60 Min)",
    price: 29,
    unit: "per player",
    tag: "Most Popular",
    features: [
      "All game zones",
      "60-minute session",
      
    ],
    cta: "Book All-Access",
    href: "/programs",
  },
  {
    tier: "Celebration",
    name: "Party Package (90 Min)",
    price: 38,
    unit: "per player",
    tag: null,
    features: [
      "All game zones",
       "90-minute session",
    ],
    cta: "Book Party",
    href: "/kids-birthday-parties",
  },
];

/* ─── Why Pixel Pulse reasons ─── */
const WHY_REASONS = [
  {
    icon: "🧠",
    title: "Active games, not screen time",
    body: "Players move between rooms that use timing, teamwork, aiming, climbing, and quick decisions.",
  },
  {
    icon: "🛡️",
    title: "Staff nearby",
    body: "Our team helps guests get started, explains the rules, and keeps the flow moving during busy sessions.",
  },
  {
    icon: "⚡",
    title: "Easy session choices",
    body: "Choose 30, 60, or 90 minutes. Add arcade time or book a party package when you need more room.",
  },
  {
    icon: "🎪",
    title: "Good for mixed groups",
    body: "Kids, teens, parents, friends, school groups, and work teams can all find games that fit their pace.",
  },
];

/* ─── Testimonials ─── */
const REVIEWS = [
  {
    stars: 5,
    body: "The kids tried several rooms and still had energy to keep going. Booking was simple and the staff explained everything clearly.",
    name: "Sarah M.",
    role: "Mom of 3 · Vaughan",
  },
  {
    stars: 5,
    body: "We booked a birthday party and it was easy to manage. The room was ready, the games kept everyone busy, and the timing worked well.",
    name: "James T.",
    role: "Dad · Woodbridge",
  },
  {
    stars: 5,
    body: "Our team came after work and it gave everyone something to do right away. It was active without being awkward.",
    name: "Aisha K.",
    role: "HR Manager · Maple",
  },
];

const Home = async () => {
  const location_slug = LOCATION_NAME;

  let waiverLink = "";
  let data = [];
  let dataconfig = [];
  let promotions = [];

  try {
    [waiverLink, data, dataconfig, promotions] = await Promise.all([
      getWaiverLink(location_slug),
      fetchMenuData(location_slug),
      fetchsheetdata("config", location_slug),
      fetchsheetdata("promotions", location_slug),
    ]);
  } catch (error) {
    console.error("home page data failed:", error);
  }

  const homepageSection1 =
    Array.isArray(dataconfig)
      ? dataconfig.find((item) => item.key === "homepageSection1")?.value ?? ""
      : "";
  const homepageIntro =
    homepageSection1 ||
    "Book a 30, 60, or 90 minute play session in Vaughan. Kids, teens, adults, parties, and groups can rotate through interactive game rooms with staff nearby to help.";

  const safePromotions = Array.isArray(promotions)
    ? JSON.parse(JSON.stringify(promotions))
    : [];

  const header_image = Array.isArray(data)
    ? data.filter((item) => item.path === "home")
    : [];

  const safeHeaderImage = header_image
    ? JSON.parse(JSON.stringify(header_image))
    : {};

  const attractionsData = Array.isArray(data)
    ? getDataByParentId(data, "attractions") || []
    : [];

  const blogsData = Array.isArray(data)
    ? getDataByParentId(data, "blogs") || []
    : [];

  return (
    <main className="ppp-home">
      {/* ── Hero ── */}
      <MotionImage pageData={safeHeaderImage} waiverLink={waiverLink} />

      {/* ── Quick-action CTA bar ── */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="ppp-ctabar">
          <div className="aero-max-container ppp-ctabar__inner">
            <SectionHeading>
              PLAN YOUR <span>VISIT</span>
            </SectionHeading>

            <div className="ppp-ctabar__buttons">
              <BookingButton title="Book Now" className="ppp-btn ppp-btn--primary" bookingType="ticket" />
              <Link href="/kids-birthday-parties" className="ppp-btn ppp-btn--outline" prefetch>
                BIRTHDAY PARTIES
              </Link>
              <Link href="/attractions" className="ppp-btn ppp-btn--outline" prefetch>
                VIEW ATTRACTIONS
              </Link>
            </div>
          </div>
          <div className="aero_home_triangle" />
        </section>
      )}

      {/* ── Intro section ── */}
      <section className="ppp-intro">
        <div className="aero-max-container ppp-intro__inner">
          <SectionHeading>
            <span>PLAY SESSIONS</span>
            <br />
            IN VAUGHAN
          </SectionHeading>
          <p className="ppp-intro__body">{homepageIntro}</p>
        </div>
      </section>

      {/* ── Stats bar ── 
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="ppp-stats">
          <div className="aero-max-container ppp-stats__grid">
            {STATS.map((item, i) => (
              <article key={i} className="ppp-stats__card">
                <Countup num={item.num} />
                <span className="ppp-stats__label">{item.label}</span>
              </article>
            ))}
          </div>
        </section>
      )}*/}

      {/* ── Attractions grid ── */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="ppp-section ppp-attractions">
          <div className="aero-max-container">
            <SectionHeading className="section-heading-white">
              GAME <span>ROOMS</span>
            </SectionHeading>
            <p className="ppp-section__sub">
              Try laser mazes, tile challenges, climbing, aiming games, sports rooms, and other active challenges during your session.
            </p>

            <ul className="ppp-attractions__grid">
              {attractionsData[0]?.children?.slice(0, 8).map((item, i) => (
                <li key={i} className="ppp-attractions__item">
                  <Link href={`/${item?.parentid}/${item?.path}`} prefetch>
                    <article className="ppp-attraction-card">
                      <figure className="ppp-attraction-card__fig">
                        <Image
                          src={item?.smallimage}
                          width={400}
                          height={260}
                          alt={item?.iconalttextforhomepage}
                          unoptimized
                          className="ppp-attraction-card__img"
                        />
                        <div className="ppp-attraction-card__overlay">
                          <h3 className="ppp-attraction-card__title">
                            {item?.desc}
                          </h3>
                        </div>
                      </figure>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ppp-section__cta-row">
              <Link href="/attractions" className="ppp-btn ppp-btn--outline" prefetch>
                View All Attractions →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Promotions ── */}
      {safePromotions?.length > 0 && (
        <section className="ppp-section ppp-promos">
          <div className="aero-max-container">
            <SectionHeading className="section-heading-white">
              Current <span>Promotions</span>
            </SectionHeading>
            <p className="ppp-section__sub">
              Check current offers before you book. Availability and details may change by date.
            </p>

            <div className="promotions__grid">
              {safePromotions.map((promo, index) => (
                <article key={index} className="promotion-card">
                  <span className="promotion-card__badge">{promo.badge}</span>
                  <h3 className="promotion-card__title">{promo.title}</h3>
                  <p className="promotion-card__description">{promo.description}</p>
                  <div className="promotion-card__details">
                    <time className="promotion-card__validity">{promo.validity}</time>
                    <span className="promotion-card__code">Code: {promo.code}</span>
                  </div>
                  <a href={promo.link} className="promotion-card__btn">
                    {promo.linktext}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Celebrate / Events ── */}
      <CelebrateEventsSection />

      {/* ── Why Pixel Pulse ── */}
      <section className="ppp-section ppp-why">
        <div className="aero-max-container">
          <SectionHeading>
            WHAT TO <span>EXPECT</span>
          </SectionHeading>

          <ul className="ppp-why__grid">
            {WHY_REASONS.map((r, i) => (
              <li key={i} className="ppp-why__card">
                <span className="ppp-why__icon" aria-hidden="true">
                  {r.icon}
                </span>
                <h3 className="ppp-why__title">{r.title}</h3>
                <p className="ppp-why__body">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="ppp-section ppp-pricing" id="pricing">
        <div className="aero-max-container">
          <SectionHeading className="section-heading-white">
            SESSION <span>PRICING</span>
          </SectionHeading>
          <p className="ppp-section__sub">
            Pick the amount of play time you want. Party bookings and group visits can be planned separately.
          </p>

          <div className="ppp-pricing__grid">
            {PRICING.map((p, i) => (
              <article
                key={i}
                className={`ppp-pricing__card${p.tag ? " ppp-pricing__card--featured" : ""}`}
              >
                {p.tag && (
                  <span className="ppp-pricing__badge">{p.tag}</span>
                )}
                <p className="ppp-pricing__tier">{p.tier}</p>
                <h3 className="ppp-pricing__name">{p.name}</h3>
                <div className="ppp-pricing__price">
                  <span className="ppp-pricing__dollar">$</span>
                  <span className="ppp-pricing__amount">{p.price}</span>
                  <span className="ppp-pricing__unit">/{p.unit}</span>
                </div>
                <ul className="ppp-pricing__features">
                  {p.features.map((f, j) => (
                    <li key={j} className="ppp-pricing__feature">
                      <span className="ppp-pricing__check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <BookingButton
                  title={p.cta}
                  className="ppp-btn ppp-btn--primary ppp-pricing__cta"
                  bookingType={p.href === "/kids-birthday-parties" ? "party" : "ticket"}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="ppp-section ppp-reviews">
        <div className="aero-max-container">
          <SectionHeading>
            RECENT <span>VISITS</span>
          </SectionHeading>

          <div className="ppp-reviews__grid">
            {REVIEWS.map((r, i) => (
              <article key={i} className="ppp-review-card">
                <div className="ppp-review-card__stars" aria-label={`${r.stars} stars`}>
                  {"★".repeat(r.stars)}
                </div>
                <blockquote className="ppp-review-card__quote">
                  "{r.body}"
                </blockquote>
                <footer className="ppp-review-card__footer">
                  <div className="ppp-review-card__avatar" aria-hidden="true">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="ppp-review-card__name">{r.name}</p>
                    <p className="ppp-review-card__role">{r.role}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog / Articles ── */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="ppp-section ppp-blog">
          <div className="aero-max-container">
            <SectionHeading className="section-heading-white">
              TIPS BEFORE <span>YOU VISIT</span>
            </SectionHeading>
            <p className="ppp-section__sub">
              Helpful notes for birthdays, group bookings, game rooms, and planning your next visit.
            </p>

            <BlogCard blogsData={blogsData[0]} location_slug={location_slug} />

            <div className="ppp-section__cta-row">
              <Link href="/blogs" className="ppp-btn ppp-btn--outline" prefetch>
                View All Articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA band ── */}
      <section className="ppp-cta-band">
        <div className="aero-max-container ppp-cta-band__inner">
          <SectionHeading>
            READY TO <span>BOOK?</span>
          </SectionHeading>
          <p className="ppp-cta-band__sub">
            Reserve your play time online. Walk-ins are welcome when space is available.
            Pixel Pulse Play is located in Vaughan and serves families and groups across the GTA.
          </p>
          <div className="ppp-cta-band__actions">
            <BookingButton title="Book Now" className="ppp-btn ppp-btn--primary" bookingType="ticket" />
            <Link
              href="https://maps.app.goo.gl/anxfwSCGYZNpNmnC7"
              className="ppp-btn ppp-btn--outline"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
            >
              Get Directions
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pixel Pulse branded section ── */}
      <PixelPulseSection />

      {/* ── JSON-LD ── */}
      {location_slug === LOCATION_NAME && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pixelPulseSchema) }}
        />
      )}
    </main>
  );
};

export default Home;
