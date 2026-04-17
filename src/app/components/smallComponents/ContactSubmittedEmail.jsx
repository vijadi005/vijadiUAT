"use client";

import { useEffect, useState } from "react";

export default function ContactSubmittedEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(window.sessionStorage.getItem("pppContactEmail") || "");
  }, []);

  if (!email) {
    return (
      <>
        <p className="ppp-contact-thanks__message">
          Your Pixel Pulse Play request is in our queue.
        </p>
        <p className="ppp-contact-thanks__text">
          We will be in touch within 24 hours.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="ppp-contact-thanks__message">
        <span className="ppp-contact-thanks__email">{email}</span>
      </p>
      <p className="ppp-contact-thanks__text">
        We will be in touch within 24 hours.
      </p>
    </>
  );
}
