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
    attractionsFinalCtaTitle: getValue([
      "attractionsFinalCtaTitle",
      "attractionFinalCtaTitle",
    ]),
    attractionsFinalCtaSubtitle: getValue([
      "attractionsFinalCtaSubtitle",
      "attractionFinalCtaSubtitle",
    ]),
    attractionsFinalCtaPrimaryText: getValue([
      "attractionsFinalCtaPrimaryText",
      "attractionFinalCtaPrimaryText",
    ]),
    attractionsFinalCtaPrimaryBookingType:
      getValue([
        "attractionsFinalCtaPrimaryBookingType",
        "attractionFinalCtaPrimaryBookingType",
      ]) || "ticket",
    attractionsFinalCtaSecondaryText: getValue([
      "attractionsFinalCtaSecondaryText",
      "attractionFinalCtaSecondaryText",
    ]),
    attractionsFinalCtaSecondaryBookingType:
      getValue([
        "attractionsFinalCtaSecondaryBookingType",
        "attractionFinalCtaSecondaryBookingType",
      ]) || "party",
    groupsHeroSubtitle: getValue([
      "groupsHeroSubtitle",
      "groupHeroSubtitle",
    ]),
    groupsHeroPrimaryText: getValue([
      "groupsHeroPrimaryText",
      "groupHeroPrimaryText",
    ]),
    groupsHeroPrimaryBookingType:
      getValue([
        "groupsHeroPrimaryBookingType",
        "groupHeroPrimaryBookingType",
      ]) || "party",
    groupsHeroSecondaryText: getValue([
      "groupsHeroSecondaryText",
      "groupHeroSecondaryText",
    ]),
    groupsHeroSecondaryHref: getValue([
      "groupsHeroSecondaryHref",
      "groupHeroSecondaryHref",
    ]),
    groupsCardsHeading: getValue([
      "groupsCardsHeading",
      "groupCardsHeading",
    ]),
    groupsFinalCtaTitle: getValue([
      "groupsFinalCtaTitle",
      "groupFinalCtaTitle",
    ]),
    groupsFinalCtaSubtitle: getValue([
      "groupsFinalCtaSubtitle",
      "groupFinalCtaSubtitle",
    ]),
    groupsFinalCtaPrimaryText: getValue([
      "groupsFinalCtaPrimaryText",
      "groupFinalCtaPrimaryText",
    ]),
    groupsFinalCtaPrimaryBookingType:
      getValue([
        "groupsFinalCtaPrimaryBookingType",
        "groupFinalCtaPrimaryBookingType",
      ]) || "party",
    groupsFinalCtaSecondaryText: getValue([
      "groupsFinalCtaSecondaryText",
      "groupFinalCtaSecondaryText",
    ]),
    groupsFinalCtaSecondaryHref: getValue([
      "groupsFinalCtaSecondaryHref",
      "groupFinalCtaSecondaryHref",
    ]),
    birthdayFinalCtaTitle: getValue([
      "birthdayFinalCtaTitle",
      "partyFinalCtaTitle",
    ]),
    birthdayFinalCtaSubtitle: getValue([
      "birthdayFinalCtaSubtitle",
      "partyFinalCtaSubtitle",
    ]),
    birthdayFinalCtaPrimaryText: getValue([
      "birthdayFinalCtaPrimaryText",
      "partyFinalCtaPrimaryText",
    ]),
    birthdayFinalCtaSecondaryText: getValue([
      "birthdayFinalCtaSecondaryText",
      "partyFinalCtaSecondaryText",
    ]),
    birthdayFinalCtaSecondaryBookingType:
      getValue([
        "birthdayFinalCtaSecondaryBookingType",
        "partyFinalCtaSecondaryBookingType",
      ]) || "party",
    pricingPromoInlineCtaTitle: getValue([
      "pricingPromoInlineCtaTitle",
      "pricingPromosInlineCtaTitle",
    ]),
    pricingPromoInlineCtaSubtitle: getValue([
      "pricingPromoInlineCtaSubtitle",
      "pricingPromosInlineCtaSubtitle",
    ]),
    pricingPromoInlineCtaButtonText: getValue([
      "pricingPromoInlineCtaButtonText",
      "pricingPromosInlineCtaButtonText",
    ]),
    pricingPromoInlineCtaBookingType:
      getValue([
        "pricingPromoInlineCtaBookingType",
        "pricingPromosInlineCtaBookingType",
      ]) || "party",
    pricingPromoFinalCtaTitle: getValue([
      "pricingPromoFinalCtaTitle",
      "pricingPromosFinalCtaTitle",
    ]),
    pricingPromoFinalCtaAccent: getValue([
      "pricingPromoFinalCtaAccent",
      "pricingPromosFinalCtaAccent",
    ]),
    pricingPromoFinalCtaSubtitle: getValue([
      "pricingPromoFinalCtaSubtitle",
      "pricingPromosFinalCtaSubtitle",
    ]),
    pricingPromoFinalCtaHighlight: getValue([
      "pricingPromoFinalCtaHighlight",
      "pricingPromosFinalCtaHighlight",
    ]),
    pricingPromoFinalCtaPrimaryText: getValue([
      "pricingPromoFinalCtaPrimaryText",
      "pricingPromosFinalCtaPrimaryText",
    ]),
    pricingPromoFinalCtaPrimaryBookingType:
      getValue([
        "pricingPromoFinalCtaPrimaryBookingType",
        "pricingPromosFinalCtaPrimaryBookingType",
      ]) || "ticket",
    pricingPromoFinalCtaSecondaryText: getValue([
      "pricingPromoFinalCtaSecondaryText",
      "pricingPromosFinalCtaSecondaryText",
    ]),
    pricingPromoFinalCtaSecondaryBookingType:
      getValue([
        "pricingPromoFinalCtaSecondaryBookingType",
        "pricingPromosFinalCtaSecondaryBookingType",
      ]) || "ticket",
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
