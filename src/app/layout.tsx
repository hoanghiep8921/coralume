import type { Metadata } from "next";
import { Lexend, Lora, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Font loading strategy from Stitch DESIGN.md (coralume_design_system)
// Lexend: display-lg, headline-md (headlines, nav)
// Lora: heading-serif (subtle headings, quotes)
// Be Vietnam Pro: body-lg, body-md, label-sm (Vietnamese optimized)
// JetBrains Mono: data-mono (numbers, stats, IDs)
const lexend = Lexend({
  variable: "--font-display",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-heading-serif",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương",
    template: "%s | Coralume",
  },
  description:
    "Nền tảng nhận nuôi san hô kết hợp behavioral economics + ESG. Mỗi san hô có tên riêng, được theo dõi và cập nhật ảnh/video định kỳ từ trung tâm tại Nha Trang.",
  keywords: [
    "san hô",
    "bảo tồn biển",
    "adopt a coral",
    "Nha Trang",
    "ESG",
    "môi trường",
  ],
  authors: [{ name: "Coralume" }],
  creator: "Coralume",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://coralume.vn",
    siteName: "Coralume",
    title: "Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương",
    description:
      "Nền tảng nhận nuôi san hô kết hợp behavioral economics + ESG. Theo dõi san hô của bạn qua dashboard.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương",
    description:
      "Nền tảng nhận nuôi san hô kết hợp behavioral economics + ESG.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${lexend.variable} ${beVietnamPro.variable} ${lora.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {/* Skip-to-content — WCAG 2.4.1 Bypass Blocks */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-secondary focus:text-on-secondary focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          Bỏ qua và đến nội dung chính
        </a>
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
