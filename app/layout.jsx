import "./globals.css";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader"
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono"
});

export const metadata = {
  title: "Aaron Cannata — Value Engineering & Business Case Consulting",
  description:
    "I build the financial models, ROI calculators, and executive briefs that turn complex workforce decisions into board-ready business cases."
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
