import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const description =
  "I build pipeline from zero, close complex enterprise deals, and translate business value into numbers a CFO will sign. San Diego, CA.";

export const metadata = {
  metadataBase: new URL("https://aaroncannata.com"),
  title: "Aaron Cannata | Enterprise Account Executive",
  description,
  openGraph: {
    title: "Aaron Cannata | Enterprise Account Executive",
    description,
    url: "https://aaroncannata.com",
    siteName: "Aaron Cannata",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Aaron Cannata | Enterprise Account Executive",
    description
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-navy font-sans antialiased">{children}</body>
    </html>
  );
}
