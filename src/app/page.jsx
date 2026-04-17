import "./styles/home.css";
import "./styles/pagenew.css";
import "./styles/promotions.css";
import Image from "next/image";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import MotionImage from "@/components/MotionImage";
import BlogCard from "@/components/smallComponents/BlogCard";
import {
  fetchsheetdata,
  fetchMenuData,
  getWaiverLink,
  generateMetadataLib,
} from "@/lib/sheets";
import { LOCATION_NAME } from "./lib/constant";
import SectionHeading from "./components/home/SectionHeading";
import BookingButton from "./components/smallComponents/BookingButton";
import PromotionModal from "./components/model/PromotionModal";

export const dynamic = "force-dynamic";

const SITE_DATA_GOOGLE_SHEET_ID = "1NEovNJVBVY4LyXWg3nHFh5-LekMt8GfL4y4eaNz7X1I";
const SITE_DATA_SHEET_NAMES = [
  "hero",
  "howItWorks",
  "howItWorksMeta",
  "games",
  "whyUs",
  "useCases",
  "pricing",
  "pricingMeta",
  "leaderboard",
  "promotions",
  "testimonials",
  "location",
];

const BIRTHDAY_VAULT_PROMO_IMAGE =
  "https://storage.googleapis.com/pixel-pulse-play/web/PrivateParty.png";
const SCHOOL_TRIPS_PROMO_IMAGE =
  "https://storage.googleapis.com/pixel-pulse-play/web/SchoolTrips.png";

const emptySiteData = {
  hero: {
    headline: "",
    headlineSub: "",
    subheadline: "",
    ctaPrimary: "",
    ctaSecondary: "",
    urgencyStrip: "",
    trust: [],
  },
  howItWorks: {
    cta: "",
    ctaButton: "",
    title: "",
    accent: "",
    subtitle: "",
    steps: [],
  },
  games: [],
  whyUs: [],
  useCases: [],
  pricing: [],
  pricingCta: {
    text: "",
    button: "",
    bookingType: "ticket",
  },
  leaderboard: [],
  promotions: [],
  testimonials: [],
  location: {
    title: "",
    address: "",
    walkIn: "",
    mapsLink: "",
    finalStrip: "",
  },
};

function googleSheetCsvUrl(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SITE_DATA_GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&cachebust=${Date.now()}`;
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers = [], ...dataRows] = rows.filter((csvRow) =>
    csvRow.some((cell) => String(cell).trim()),
  );

  return dataRows.map((csvRow) =>
    headers.reduce((acc, header, index) => {
      acc[String(header).trim()] = csvRow[index] ?? "";
      return acc;
    }, {}),
  );
}

async function fetchGoogleSheetRows(sheetName) {
  const response = await fetch(googleSheetCsvUrl(sheetName), { cache: "no-store" });
  if (!response.ok) {
    console.warn(`Optional Google Sheet tab not loaded: ${sheetName}`);
    return [];
  }
  return parseCsv(await response.text());
}

async function fetchGoogleSiteDataSheets() {
  const entries = await Promise.all(
    SITE_DATA_SHEET_NAMES.map(async (sheetName) => [
      sheetName,
      await fetchGoogleSheetRows(sheetName).catch((error) => {
        console.warn(`Optional Google Sheet tab failed: ${sheetName} (${error.message})`);
        return [];
      }),
    ]),
  );

  return Object.fromEntries(entries);
}

function rowsFromSheet(sheets, sheetName) {
  return sheets[sheetName] || [];
}

function keyValueSheet(sheets, sheetName) {
  return rowsFromSheet(sheets, sheetName).reduce((acc, row) => {
    if (row.field) acc[row.field] = row.value;
    return acc;
  }, {});
}

function splitList(value) {
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBool(value) {
  return ["true", "yes", "1"].includes(String(value).trim().toLowerCase());
}

function parseRating(value, fallback = 5) {
  const rating = Number(value || fallback);
  if (!Number.isFinite(rating)) return fallback;
  return Math.min(5, Math.max(0, Math.round(rating)));
}

function parseVisibleFlag(value, fallback = true) {
  const normalizedValue = String(value ?? "").trim().toLowerCase();
  if (!normalizedValue) {
    return fallback;
  }

  if (["true", "yes", "1", "show", "visible", "enabled"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "no", "0", "hide", "hidden", "disabled"].includes(normalizedValue)) {
    return false;
  }

  return fallback;
}

function configValue(configData, key) {
  return Array.isArray(configData)
    ? configData.find((item) => item.key === key)?.value ?? ""
    : "";
}

function hasSheetField(sheet, field) {
  return Object.prototype.hasOwnProperty.call(sheet, field);
}

function sheetValue(sheet, field) {
  return hasSheetField(sheet, field) ? sheet[field] : "";
}

function keyValueDataFromSheet(sheet, fields) {
  return fields.reduce((acc, field) => {
    acc[field] = sheetValue(sheet, field);
    return acc;
  }, {});
}

function parseSiteDataSheets(sheets) {
  const hero = keyValueSheet(sheets, "hero");
  const howCta = keyValueSheet(sheets, "howItWorksMeta");
  const location = keyValueSheet(sheets, "location");
  const pricingMeta = keyValueSheet(sheets, "pricingMeta");
  const heroData = keyValueDataFromSheet(hero, Object.keys(emptySiteData.hero));
  const locationData = keyValueDataFromSheet(location, Object.keys(emptySiteData.location));

  return {
    hero: {
      ...heroData,
      trust: heroData.trust ? splitList(heroData.trust) : [],
    },
    howItWorks: {
      title: sheetValue(howCta, "title"),
      accent: sheetValue(howCta, "accent"),
      subtitle: sheetValue(howCta, "subtitle"),
      cta: sheetValue(howCta, "cta"),
      ctaButton: sheetValue(howCta, "ctaButton"),
      steps: rowsFromSheet(sheets, "howItWorks").map((row) => ({
        n: String(row.n || ""),
        title: String(row.title || ""),
        desc: String(row.desc || ""),
      })).filter((row) => row.title || row.desc),
    },
    games: rowsFromSheet(sheets, "games").map((row) => ({
      id: String(row.id || ""),
      name: String(row.name || ""),
      tag: String(row.tag || ""),
      diff: Number(row.diff || 0),
      bestFor: String(row.bestFor || ""),
      color: String(row.color || ""),
      emoji: String(row.emoji || ""),
    })).filter((row) => row.name || row.tag),
    whyUs: rowsFromSheet(sheets, "whyUs").map((row) => ({
      icon: String(row.icon || ""),
      title: String(row.title || ""),
      desc: String(row.desc || ""),
    })).filter((row) => row.title || row.desc),
    useCases: rowsFromSheet(sheets, "useCases").map((row) => ({
      icon: String(row.icon || ""),
      title: String(row.title || ""),
      sub: String(row.sub || ""),
      cta: String(row.cta || ""),
      linktext: String(row.linktext || row.linkText || row.link_text || ""),
      link: String(row.link || row.url || row.href || ""),
      linktitle: String(row.linktitle || row.linkTitle || row.link_title || ""),
    })).filter((row) => row.title || row.sub),
    pricing: rowsFromSheet(sheets, "pricing").map((row) => ({
      id: String(row.id || ""),
      name: String(row.name || ""),
      duration: String(row.duration || ""),
      price: String(row.price || ""),
      tag: String(row.tag || ""),
      features: splitList(row.features),
      cta: String(row.cta || ""),
      highlight: parseBool(row.highlight),
      note: String(row.note || ""),
    })).filter((row) => row.name || row.price),
    pricingCta: {
      text: sheetValue(pricingMeta, "ctaText") || "Can you beat all the rooms in 60 minutes?",
      button: sheetValue(pricingMeta, "ctaButton"),
      bookingType: sheetValue(pricingMeta, "ctaBookingType") || "ticket",
    },
    leaderboard: rowsFromSheet(sheets, "leaderboard").map((row) => ({
      rank: String(row.rank || ""),
      name: String(row.name || ""),
      game: String(row.game || ""),
      score: String(row.score || ""),
      time: String(row.time || ""),
    })).filter((row) => row.name || row.game || row.score),
    promotions: rowsFromSheet(sheets, "promotions").map((row) => ({
      tag: String(row.tag || ""),
      title: String(row.title || ""),
      desc: String(row.desc || ""),
      code: String(row.code || ""),
      valid: String(row.valid || ""),
      linktext: String(row.linktext || row.linkText || row.link_text || ""),
      link: String(row.link || row.url || row.href || ""),
      linktitle: String(row.linktitle || row.linkTitle || row.link_title || ""),
      image: String(row.image || row.imageUrl || row.imageurl || row.image_url || ""),
      imageAlt: String(row.imageAlt || row.imagealt || row.image_alt || ""),
    })).filter((row) => row.title || row.desc),
    testimonials: rowsFromSheet(sheets, "testimonials").map((row) => ({
      name: String(row.name || ""),
      role: String(row.role || ""),
      quote: String(row.quote || ""),
      rating: parseRating(row.rating || row.stars),
    })).filter((row) => row.name || row.quote),
    location: locationData,
  };
}

function getPromotionImage(promo = {}, index = 0) {
  const sheetImage =
    promo.image ||
    promo.imageUrl ||
    promo.imageurl ||
    promo.image_url ||
    "";

  if (sheetImage) {
    return {
      src: sheetImage,
      alt: promo.imageAlt || promo.imagealt || promo.image_alt || `${promo.title || "Promotion"} image`,
    };
  }

  const normalizedTitle = String(promo.title || "").toLowerCase();

  if (normalizedTitle.includes("birthday vault")) {
    return {
      src: BIRTHDAY_VAULT_PROMO_IMAGE,
      alt: "Private party celebration at Pixel Pulse Play",
    };
  }

  if (normalizedTitle.includes("school trip")) {
    return {
      src: SCHOOL_TRIPS_PROMO_IMAGE,
      alt: "School trip group at Pixel Pulse Play",
    };
  }

  if (index === 1) {
    return {
      src: SCHOOL_TRIPS_PROMO_IMAGE,
      alt: "School trip group at Pixel Pulse Play",
    };
  }

  return null;
}

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

const Home = async () => {
  const location_slug = LOCATION_NAME;

  let waiverLink = "";
  let data = [];
  let dataconfig = [];
  let siteData = emptySiteData;

  try {
    [waiverLink, data, dataconfig, siteData] = await Promise.all([
      getWaiverLink(location_slug),
      fetchMenuData(location_slug),
      fetchsheetdata("config", location_slug),
      fetchGoogleSiteDataSheets().then(parseSiteDataSheets),
    ]);
  } catch (error) {
    console.error("home page data failed:", error);
  }

  const homepageSection1 = configValue(dataconfig, "homepageSection1");
  const homepageIntroHeading = configValue(dataconfig, "homepageIntroHeading");
  const homepageIntroHeadingAccent = configValue(dataconfig, "homepageIntroHeadingAccent");
  const showHomepageIntro = parseVisibleFlag(
    configValue(dataconfig, "homepageIntroVisible") ||
      configValue(dataconfig, "homepageIntroShow"),
    true
  );
  const promotionPopup = Array.isArray(dataconfig)
    ? dataconfig.filter((item) => item.key === "promotion-popup")
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
  const blogSectionHeading =
    blogsData?.[0]?.headerimagetitle || "Tips before you visit";

  return (
    <main className="ppp-home">
      <PromotionModal promotionPopup={promotionPopup} delayMs={5000} />

      {/* ── Hero ── */}
      <MotionImage pageData={safeHeaderImage} heroData={siteData.hero} waiverLink={waiverLink} />

      {(siteData.hero.urgencyStrip || siteData.hero.ctaPrimary) && (
      <section className="ppp-mini-cta">
        <div className="aero-max-container ppp-mini-cta__inner">
          {siteData.hero.urgencyStrip && <p>{siteData.hero.urgencyStrip}</p>}
          {siteData.hero.ctaPrimary && (
            <BookingButton title={siteData.hero.ctaPrimary} className="ppp-btn ppp-btn--primary" bookingType="ticket" />
          )}
        </div>
      </section>
      )}

      {siteData.howItWorks.steps.length > 0 && (
      <section className="ppp-section ppp-how">
        <div className="aero-max-container">
          {(siteData.howItWorks.title || siteData.howItWorks.accent) && (
            <SectionHeading>
              {siteData.howItWorks.title} {siteData.howItWorks.accent && <span>{siteData.howItWorks.accent}</span>}
            </SectionHeading>
          )}
          {siteData.howItWorks.subtitle && (
            <p className="ppp-section__sub">{siteData.howItWorks.subtitle}</p>
          )}

          <ol className="ppp-how__grid">
            {siteData.howItWorks.steps.map((step, index) => {
              const normalizedStepTitle = String(step.title || "").toLowerCase();
              const isArenaStep = normalizedStepTitle.includes("enter the arena");
              const isPlayCompeteStep =
                normalizedStepTitle.includes("play") &&
                (normalizedStepTitle.includes("compete") ||
                  normalizedStepTitle.includes("complete"));
              const isBeatGameStep =
                normalizedStepTitle.includes("beat") &&
                normalizedStepTitle.includes("game");
              const cardClassName = [
                "ppp-how__card",
                isArenaStep ? "ppp-how__card--arena" : "",
                isPlayCompeteStep ? "ppp-how__card--play-compete" : "",
                isBeatGameStep ? "ppp-how__card--beat-game" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
              <li
                key={step.title}
                className={cardClassName}
              >
                <span className="ppp-how__watermark">{step.n || index + 1}</span>
                <span className="ppp-how__number">{step.n || index + 1}</span>
                <h3 className="ppp-how__title">{step.title}</h3>
                <p className="ppp-how__desc">{step.desc}</p>
              </li>
              );
            })}
          </ol>
        </div>
      </section>
      )}

      {/* ── Intro section ── */}
      {showHomepageIntro && (homepageIntroHeading || homepageIntroHeadingAccent || homepageSection1) && (
      <section className="ppp-intro">
        <div className="aero-max-container ppp-intro__inner">
          {(homepageIntroHeading || homepageIntroHeadingAccent) && (
            <SectionHeading>
              {homepageIntroHeadingAccent && <span>{homepageIntroHeadingAccent}</span>}
              {homepageIntroHeadingAccent && homepageIntroHeading && <br />}
              {homepageIntroHeading}
            </SectionHeading>
          )}
          {homepageSection1 && <p className="ppp-intro__body">{homepageSection1}</p>}
        </div>
      </section>
      )}

      {/* ── Why Pixel Pulse ── */}
      {siteData.whyUs.length > 0 && (
      <section className="ppp-section ppp-why">
        <div className="aero-max-container">
          <ul className="ppp-why__grid">
            {siteData.whyUs.map((r, i) => (
              <li key={i} className="ppp-why__card">
                {r.icon && <span className="ppp-why__icon" aria-hidden="true">{r.icon}</span>}
                <h3 className="ppp-why__title">{r.title}</h3>
                <p className="ppp-why__body">{r.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ── Attractions grid ── */}
      {siteData.games.length > 0 && (
        <section className="ppp-section ppp-attractions">
          <div className="aero-max-container">
            <ul className="ppp-attractions__grid">
              {siteData.games.map((game, i) => {
                const item = attractionsData?.[0]?.children?.[i] || {};
                return (
                <li key={i} className="ppp-attractions__item">
                  <Link href={item?.parentid && item?.path ? `/${item.parentid}/${item.path}` : "#"} prefetch>
                    <article className="ppp-attraction-card">
                      <figure className="ppp-attraction-card__fig">
                        {item?.smallimage && (
                          <Image
                            src={item.smallimage}
                            width={400}
                            height={260}
                            alt={item?.iconalttextforhomepage || game.name}
                            unoptimized
                            className="ppp-attraction-card__img"
                          />
                        )}
                        <div className="ppp-attraction-card__overlay">
                          <h3 className="ppp-attraction-card__title">
                            {game.name}
                          </h3>
                          {game.tag && <p className="ppp-attraction-card__body">{game.tag}</p>}
                          {game.bestFor && <span className="ppp-attraction-card__meta">{game.bestFor}</span>}
                        </div>
                      </figure>
                    </article>
                  </Link>
                </li>
              );
              })}
            </ul>

          </div>
        </section>
      )}

      {siteData.howItWorks.cta && (
      <section className="ppp-mini-cta">
        <div className="aero-max-container ppp-mini-cta__inner">
          <p>{siteData.howItWorks.cta}</p>
          <div className="ppp-mini-cta__actions">
            {siteData.howItWorks.ctaButton && (
              <BookingButton title={siteData.howItWorks.ctaButton} className="ppp-btn ppp-btn--primary" bookingType="ticket" />
            )}
            <Link href="/attractions" className="ppp-btn ppp-btn--outline" prefetch>
              View All Attractions
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── Promotions ── */}
      {siteData.promotions.length > 0 && (
        <section className="ppp-section ppp-promos">
          <div className="aero-max-container">
            <div className="promotions__grid">
              {siteData.promotions.map((promo, index) => {
                const promoImage = getPromotionImage(promo, index);

                return (
                <article
                  key={index}
                  className={`promotion-card${promoImage ? " promotion-card--with-image" : ""}`}
                >
                  <div className="promotion-card__content">
                    {promo.tag && <span className="promotion-card__badge">{promo.tag}</span>}
                    <h3 className="promotion-card__title">{promo.title}</h3>
                    {promo.desc && <p className="promotion-card__description">{promo.desc}</p>}
                    <div className="promotion-card__details">
                      {promo.valid && <time className="promotion-card__validity">{promo.valid}</time>}
                      {promo.code && <span className="promotion-card__code">{promo.code}</span>}
                    </div>
                    {promo.link && (
                      <Link
                        href={promo.link}
                        className="promotion-card__btn"
                        target={promo.link.startsWith("http") ? "_blank" : undefined}
                        rel={promo.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        title={promo.linktitle || undefined}
                        aria-label={promo.linktitle || promo.linktext || "Claim offer"}
                        prefetch={!promo.link.startsWith("http")}
                      >
                        {promo.linktext || "Claim Offer"}
                      </Link>
                    )}
                  </div>

                  {promoImage && (
                    <div className="promotion-card__image-wrap">
                      <img
                        src={promoImage.src}
                        alt={promoImage.alt}
                        className="promotion-card__image"
                      />
                    </div>
                  )}
                </article>
              );
              })}
            </div>
          </div>
        </section>
      )}

      {siteData.pricing.length > 0 && (siteData.pricingCta.text || siteData.pricingCta.button) && (
      <section className="ppp-mini-cta ppp-pricing__tip">
        <div className="aero-max-container ppp-mini-cta__inner">
          {siteData.pricingCta.text && <p>{siteData.pricingCta.text}</p>}
          <div className="ppp-mini-cta__actions">
            {siteData.pricingCta.button && (
              <BookingButton
                title={siteData.pricingCta.button}
                className="ppp-btn ppp-btn--primary"
                bookingType={siteData.pricingCta.bookingType}
              />
            )}
            <BookingButton
              title="Book 90min Session"
              className="ppp-btn ppp-btn--primary"
              bookingType="ticket"
            />
          </div>
        </div>
      </section>
      )}

      {/* ── Pricing ── */}
      {siteData.pricing.length > 0 && (
      <section className="ppp-section ppp-pricing" id="pricing">
        <div className="aero-max-container">
          <div className="ppp-pricing__grid">
            {siteData.pricing.map((p, i) => (
              <article
                key={i}
                className={`ppp-pricing__card${p.highlight ? " ppp-pricing__card--featured" : ""}`}
              >
                {p.tag && (
                  <span className="ppp-pricing__badge">{p.tag}</span>
                )}
                {p.id && <p className="ppp-pricing__tier">{p.id}</p>}
                <h3 className="ppp-pricing__name">{p.name}</h3>
                <div className="ppp-pricing__price">
                  <span className="ppp-pricing__amount">{p.price}</span>
                  {p.duration && <span className="ppp-pricing__unit">/{p.duration}</span>}
                </div>
                <ul className="ppp-pricing__features">
                  {p.features.map((f, j) => (
                    <li key={j} className="ppp-pricing__feature">
                      <span className="ppp-pricing__check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {p.note && <p className="ppp-section__sub">{p.note}</p>}
                {p.cta && (
                  <BookingButton
                    title={p.cta}
                    className="ppp-btn ppp-btn--primary ppp-pricing__cta"
                    bookingType="ticket"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {siteData.useCases.length > 0 && (
      <section className="ppp-section ppp-use-cases">
        <div className="aero-max-container">
          <ul className="ppp-use-cases__grid">
            {siteData.useCases.map((item) => {
              const normalizedUseCaseTitle = String(item.title || "").toLowerCase();
              const isBirthdayUseCase = normalizedUseCaseTitle.includes("birthday");
              const isCorporateUseCase = normalizedUseCaseTitle.includes("corporate");
              const isSchoolTripsUseCase =
                normalizedUseCaseTitle.includes("school") ||
                normalizedUseCaseTitle.includes("field trip");
              const isFriendsDateUseCase =
                normalizedUseCaseTitle.includes("friend") ||
                normalizedUseCaseTitle.includes("date");
              const hasUseCaseImage =
                isBirthdayUseCase ||
                isCorporateUseCase ||
                isSchoolTripsUseCase ||
                isFriendsDateUseCase;

              return (
              <li
                key={item.title}
                className={[
                  "ppp-use-cases__item",
                  hasUseCaseImage ? "ppp-use-cases__item--wide" : "",
                ].filter(Boolean).join(" ")}
              >
                <article
                  className={[
                    "ppp-use-case-card",
                    isBirthdayUseCase ? "ppp-use-case-card--birthday" : "",
                    isCorporateUseCase ? "ppp-use-case-card--corporate" : "",
                    isSchoolTripsUseCase ? "ppp-use-case-card--school-trips" : "",
                    isFriendsDateUseCase ? "ppp-use-case-card--friends-date" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {item.icon && <span className="ppp-why__icon" aria-hidden="true">{item.icon}</span>}
                  <h3>{item.title}</h3>
                  {item.sub && <p>{item.sub}</p>}
                  {item.cta && <p>{item.cta}</p>}
                  {item.link && (
                    <Link
                      href={item.link}
                      className="ppp-use-case-card__link"
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      title={item.linktitle || undefined}
                      aria-label={item.linktitle || item.linktext || item.cta || item.title}
                      prefetch={!item.link.startsWith("http")}
                    >
                      {item.linktext || "Learn More"}
                    </Link>
                  )}
                </article>
              </li>
              );
            })}
          </ul>
        </div>
      </section>
      )}

      {siteData.leaderboard.length > 0 && (
      <section className="ppp-section ppp-competition">
        <div className="aero-max-container ppp-competition__inner">
          <SectionHeading className="section-heading-white">
            Top Players <span>This Week</span>
          </SectionHeading>
          <div className="ppp-competition__board" aria-label="Leaderboard">
            <div className="ppp-competition__header" aria-hidden="true">
              <span>Rank</span>
              <span>Player</span>
              <span>Game</span>
              <span>Score</span>
              <span>Time</span>
            </div>
            {siteData.leaderboard.map((row, index) => (
              <article
                key={`${row.name}-${index}`}
                className={`ppp-competition__row${index < 3 ? " ppp-competition__row--podium" : ""}`}
              >
                <span className="ppp-competition__rank">{row.rank || index + 1}</span>
                <div className="ppp-competition__player">
                  <span className="ppp-competition__avatar" aria-hidden="true">
                    {String(row.name || "P").charAt(0)}
                  </span>
                  <strong>{row.name}</strong>
                </div>
                <span className="ppp-competition__game">{row.game || "-"}</span>
                <span className="ppp-competition__score">{row.score || "-"}</span>
                <span className="ppp-competition__time">{row.time || "-"}</span>
                <p className="ppp-competition__copy">
                  {[row.game, row.score, row.time].filter(Boolean).join(" | ")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Reviews ── */}
      {siteData.testimonials.length > 0 && (
      <section className="ppp-section ppp-reviews">
        <div className="aero-max-container">
          <div className="ppp-reviews__grid">
            {siteData.testimonials.map((r, i) => (
              <article key={i} className="ppp-review-card">
                <div className="ppp-review-card__stars" aria-label={`${r.rating} out of 5 stars`}>
                  <span aria-hidden="true">{"★".repeat(r.rating)}</span>
                </div>
                <blockquote className="ppp-review-card__quote">
                  {r.quote}
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
      )}

      {/* ── Blog / Articles ── */}
      {attractionsData?.[0]?.children?.length > 0 && (
        <section className="ppp-section ppp-blog">
          <div className="aero-max-container">
            <SectionHeading className="section-heading-white ppp-blog__heading">
              {blogSectionHeading}
            </SectionHeading>

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
      {(siteData.location.title || siteData.location.address || siteData.location.walkIn || siteData.location.finalStrip) && (
      <section className="ppp-cta-band">
        <div className="aero-max-container ppp-cta-band__inner">
          <div className="ppp-cta-band__content">
            {siteData.location.title && <SectionHeading>{siteData.location.title}</SectionHeading>}
            {siteData.location.address && <p className="ppp-cta-band__sub">{siteData.location.address}</p>}
            {siteData.location.walkIn && <p className="ppp-cta-band__sub">{siteData.location.walkIn}</p>}
            {siteData.location.finalStrip && <p className="ppp-cta-band__sub">{siteData.location.finalStrip}</p>}
            <div className="ppp-cta-band__actions">
              {siteData.hero.ctaPrimary && (
                <BookingButton title={siteData.hero.ctaPrimary} className="ppp-btn ppp-btn--primary" bookingType="ticket" />
              )}
              {siteData.location.mapsLink && (
                <Link
                  href={siteData.location.mapsLink}
                  className="ppp-btn ppp-btn--outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                >
                  Find Location
                </Link>
              )}
            </div>
          </div>
          <figure className="ppp-cta-band__media">
            <img
              src="https://storage.googleapis.com/pixel-pulse-play/web/pixelreception.png"
              alt="Pixel Pulse Play reception area"
            />
          </figure>
          </div>
      </section>
      )}

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
