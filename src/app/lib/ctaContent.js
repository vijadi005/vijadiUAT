function normalizeKey(value = "") {
  return String(value || "").trim().toLowerCase();
}

export function getConfigValue(configData = [], keys = []) {
  const normalizedKeys = (Array.isArray(keys) ? keys : [keys])
    .map(normalizeKey)
    .filter(Boolean);

  if (!Array.isArray(configData) || normalizedKeys.length === 0) {
    return "";
  }

  const row = configData.find((item) =>
    normalizedKeys.includes(normalizeKey(item?.key)),
  );

  return row?.value ? String(row.value).trim() : "";
}

export function getRowValue(row = {}, keys = []) {
  const normalizedKeys = (Array.isArray(keys) ? keys : [keys])
    .map(normalizeKey)
    .filter(Boolean);

  const matchingKey = Object.keys(row || {}).find((key) =>
    normalizedKeys.includes(normalizeKey(key)),
  );

  return matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null
    ? String(row[matchingKey]).trim()
    : "";
}

export function getCtaContent(configData = {}) {
  const fromConfig = Array.isArray(configData)
    ? (keys) => getConfigValue(configData, keys)
    : () => "";
  const fromObject = !Array.isArray(configData)
    ? (keys) => getRowValue(configData, keys)
    : () => "";
  const getValue = (keys) => fromConfig(keys) || fromObject(keys);

  return {
    bookNowText: getValue([
      "cta_book_now",
      "ctaBookNow",
      "bookNowText",
      "bookNowLabel",
      "bookingButtonText",
      "headerBookNowText",
    ]),
    inquireText: getValue([
      "cta_inquire",
      "ctaInquire",
      "inquireText",
      "inquireLabel",
      "headerInquireText",
    ]),
    contactHref: getValue(["cta_contact_href", "contactHref", "inquireHref"]),
    pricingText: getValue([
      "cta_pricing",
      "ctaPricing",
      "pricingText",
      "pricingLinkText",
      "viewPricingText",
    ]),
    pricingHref: getValue(["cta_pricing_href", "pricingHref", "pricingLink"]),
    articlesText: getValue([
      "cta_articles",
      "articlesText",
      "articlesLinkText",
      "blogLinkText",
    ]),
    articlesHref: getValue(["cta_articles_href", "articlesHref", "blogLinkHref"]),
    findLocationText: getValue([
      "cta_find_location",
      "findLocationText",
      "mapsLinkText",
    ]),
    learnMoreText: getValue(["cta_learn_more", "learnMoreText", "cardLinkText"]),
    readMoreText: getValue(["cta_read_more", "readMoreText"]),
    exploreOptionText: getValue(["cta_explore_option", "exploreOptionText"]),
    claimOfferText: getValue(["cta_claim_offer", "claimOfferText", "promoLinkText"]),
    pricingSecondaryText: getValue([
      "pricingCtaSecondaryText",
      "pricingSecondaryButton",
      "pricingCtaBookButton",
    ]),
    pricingSecondaryBookingType:
      getValue(["pricingCtaSecondaryBookingType", "pricingSecondaryBookingType"]) ||
      "ticket",
    backHomeText: getValue(["cta_back_home", "backHomeText"]),
    sendAnotherText: getValue(["cta_send_another", "sendAnotherText"]),
    promotionsHeading: getValue(["promotionsHeading", "promoHeading"]),
    promotionsHeadingAccent: getValue([
      "promotionsHeadingAccent",
      "promoHeadingAccent",
    ]),
    promotionsIntro: getValue(["promotionsIntro", "promoIntro"]),
  };
}
