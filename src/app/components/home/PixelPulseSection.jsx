import React from "react";
import "src/app/styles/home/pixelpulseSection.css";
import SectionHeading from "./SectionHeading";
import BookingButton from "../smallComponents/BookingButton";

const pixelPulseContent = {
  hero: {
    title: {
      titleOne: "Welcome to",
      titleTwo: "Pixel Pulse Vaughan"
    },
    description:
      "Pixel Pulse Vaughan has indoor game rooms, arcade games, and private party spaces for families across Vaughan, Woodbridge, Maple, and Concord. Guests can book play sessions, birthday parties, field trips, team events, and group visits without needing trampolines or a traditional playground."
  },

  whyChoose: {
    title: "Why Choose Pixel Pulse Vaughan?",
    description:
      "Pixel Pulse offers supervised indoor activities for kids ages 5 to 12 across Vaughan, Woodbridge, Maple, and Concord. Game rooms encourage movement, teamwork, timing, and confidence in a clean, staff-monitored space."
  },

  attractions: {
    title: "All-New Attractions at Pixel Pulse Vaughan",
    list: [
      {
        name: "Interactive Pixel & Tile Games",
        description:
          "Sensor-based games that combine movement, speed, and simple strategy for kids, teams, and friendly competition."
      },
      {
        name: "Immersive Challenge Rooms",
        description:
          "Themed rooms that test agility, coordination, problem-solving, and focus through light, sound, and movement."
      },
      {
        name: "Laser Challenge Room",
        description:
          "Dodge, duck, and move through laser beams in a fast-paced room designed for stealth, agility, and excitement."
      },
      {
        name: "Immersive and Skill Challenges",
        description:
          "Interactive play elements designed for kids ages 5 to 12, with different challenge levels."
      },
      {
        name: "Sports Skill Games",
        description:
          "Interactive basketball, soccer, ball toss, and reaction-based games that encourage active play and teamwork."
      },
      {
        name: "Cognitive & Reaction Games",
        description:
          "Memory, timing, and pattern challenges that help kids practise focus while they play."
      },
      {
        name: "Arcade Zone",
        description:
          "A curated mix of classic and modern arcade games—perfect for breaks between challenges and group fun."
      },
      {
        name: "Private Party & Group Spaces",
        description:
          "Dedicated rooms for birthday parties, school field trips, and team events—making celebrations easy and organized."
      }
    ]
  },

  cta: "Book a Pixel Pulse visit for game rooms, birthday parties, or group play in Vaughan.",

  tagLines: [
    ["PLAY. THINK. COMPETE. REPEAT.", "Indoor Interactive Gaming for Kids in Vaughan"],
    ["WHERE KIDS MOVE, THINK & WIN", "Active gaming in Vaughan"],
    ["SMARTER FUN STARTS HERE", "Safe, active play for kids"]
  ],

  highlights: [
    "Indoor game rooms for kids and families",
    "Challenge rooms, arcades & party bookings",
    "Active play meets digital gaming — only at Pixel Pulse",
    "A Vaughan spot for active indoor play"
  ]
};


export default function PixelPulseVaughan() {
  return (
    <section className="pixel-pulse">
     {/* <div className="container hero">
        <SectionHeading>
          {pixelPulseContent.hero.title.titleOne} <br /> <span>{pixelPulseContent.hero.title.titleTwo}</span>
        </SectionHeading>
        <p>{pixelPulseContent.hero.description}</p>
      </div>

      <div className="container section">
        <h2>{pixelPulseContent.whyChoose.title}</h2>
        <p>{pixelPulseContent.whyChoose.description}</p>
      </div>

      {/* <div className="container section">
        <h2>{pixelPulseContent.attractions.title}</h2>
        <div className="grid">
          {pixelPulseContent.attractions.list.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/*<div className="container section cta-box">
        <p>{pixelPulseContent.cta}</p>
        <div className="d-flex-center aero-btn-booknow" >
          <BookingButton title={pixelPulseContent.ctaButton} />
        </div>
      </div>

       <div className="container section">
        <h2>Tag Lines</h2>
        <div className="tagline-grid">
          {pixelPulseContent.tagLines.map((tag, index) => (
            <div key={index} className="tag-card">
              <h4>{tag[0]}</h4>
              <span>{tag[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container section">
        <ul className="highlights">
          {pixelPulseContent.highlights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div> */}
    </section>
  );
}
