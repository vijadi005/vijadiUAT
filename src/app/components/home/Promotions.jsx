import React from "react";
import SectionHeading from "./SectionHeading";

const Promotions = ({
  promotions,
  heading = "",
  headingAccent = "",
  intro = "",
}) => {
//   const promoData = attractionsData?.[0]?.children || [];

//   if (!promoData.length) return null;

  return (
    <section className="aero_home_article_section">
      <div className="aero-max-container">

        {(heading || headingAccent) && (
          <SectionHeading className="section-heading-white">
            {heading} {headingAccent && <span>{headingAccent}</span>}
          </SectionHeading>
        )}

        {intro && <p>{intro}</p>}

            <div className="promotions__grid">
                {promotions.map((promo, index) => (
                  <article key={index} className="promotion-card">
                    <span className="promotion-card__badge">{promo.badge}</span>

                    <h3 className="promotion-card__title">{promo.title}</h3>

                    <p className="promotion-card__description">
                      {promo.description}
                    </p>

                    <div className="promotion-card__details">
                      <time className="promotion-card__validity">
                        {promo.validity}
                      </time>
                      <span className="promotion-card__code">
                        Code: {promo.code}
                      </span>
                    </div>

                    <a href={promo.link} className="promotion-card__btn">
                      {promo.linktext}
                    </a>
                  </article>
                ))}
              </div>

      </div>
    </section>
  );
};

export default Promotions;
