// Shared number formatting for the interactive models.
export const fmt = {
  usd: (n) =>
    n == null
      ? "N/A"
      : n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0
        }),
  usdShort: (n) => {
    if (n == null) return "N/A";
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (Math.abs(n) >= 1e3) return `$${Math.round(n / 1e3)}K`;
    return `$${Math.round(n)}`;
  },
  pct: (n) => (n == null ? "N/A" : `${Math.round(n * 100)}%`),
  num: (n) => (n == null ? "N/A" : Math.round(n).toLocaleString("en-US")),
  months: (n) => (n == null ? "N/A" : `${n.toFixed(1)} mo`)
};
