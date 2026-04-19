const TICKER_ITEMS = [
  "Children's Party Styling",
  "Milestone Celebrations",
  "Corporate Events",
  "Cobham",
  "Weybridge",
  "Esher",
  "Oxshott",
  "From £600",
  "Surrey & Beyond",
];

const Ticker = () => {
  const all = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-strip" aria-hidden="true">
      <div className="ticker-track">
        {all.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
