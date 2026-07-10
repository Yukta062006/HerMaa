import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "HerMaa - From Her First Period to Every Stage of Life",
  description:
    "AI-powered women's healthcare companion. Track periods, get personalized insights, and access expert guidance in 9 Indian languages.",
  keywords: ["women health", "period tracker", "AI health", "PCOS", "menstrual health"],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins bg-background text-hermaa-text antialiased">
        {children}
      </body>
    </html>
  );
}
