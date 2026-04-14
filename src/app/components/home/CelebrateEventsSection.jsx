import '../../styles/home/celebrateEventsSection.css';
import Link from "next/link";
import SectionHeading from "./SectionHeading";

export default function CelebrateEventsSection() {
    const eventCards = [
        {
            title: "CORPORATE EVENTS",
            img: "https://storage.googleapis.com/aerosports/team-building-aerosports-trampoline-park.png",
            desc:
                "Bring your team for active game rooms, simple booking, and a visit that gives everyone something to do right away.",
            link: "/group-events/corporate-parties-events-groups",
            linkText: "More Info",
            isNextLink: true
        },
        {
            title: "BIRTHDAY PARTIES",
            img: "https://storage.googleapis.com/aerosports/celeberate-your-birthday-parties-at-aerosports.png",
            desc:
                "Plan a kids birthday party with game time, a private room, a party host, pizza, and clear timing for the day.",
            link: "/kids-birthday-parties",
            linkText: "Compare Packages"
        },
        {
            title: "FIELD TRIPS",
            img: "https://storage.googleapis.com/aerosports/schools-field-trips-at-aerosports.png",
            desc:
                "Ask about field trip and group rates for 20 to 40 players. For food, timing, and room needs, call before booking.",
            link: "/group-events/school-groups",
            linkText: "More Info"
        }
    ];

    return (
        <section className="aero_home_article_section">
            <section className="aero-max-container">
                <SectionHeading className="section-heading-white">
                    <span>Parties</span> and groups
                </SectionHeading>


                <p>Birthday parties, school trips, and work events can be planned around your group size and schedule.</p>

                <div className="offer-section__inner container">
                    {eventCards.map((card, index) => (
                        <article className="offer-card" key={index}>
                            <div
                                className="offer-card__img"
                                style={{ backgroundImage: `url('${card.img}')` }}
                                role="img"
                                aria-label={card.title}
                            >
                                <h3 className="offer-card__title">{card.title}</h3>
                            </div>

                            <div className="offer-card__body">
                                <p>{card.desc}</p>

                                {card.isNextLink ? (
                                    <Link href={card.link} className="sigma_btn-custom">
                                        {card.linkText}
                                    </Link>
                                ) : (
                                    <a href={card.link} className="sigma_btn-custom">
                                        {card.linkText}
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    );
}
