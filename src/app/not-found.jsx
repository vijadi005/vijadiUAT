import './styles/notfound.css';
export default function NotFound() {
  return (
    <div className="not-found-container">
      <section className="not-found-card">
        <p className="not-found-eyebrow">404</p>
        <h1 className="not-found-title">Game Over... or is it?</h1>
        <p className="not-found-message">
          We couldn&apos;t find that page, but the fun&apos;s still on.
        </p>
        <a href="/" className="not-found-link">
          Head back to the arena
        </a>
      </section>
    </div>
  );
}
