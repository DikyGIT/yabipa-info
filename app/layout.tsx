import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yabipa",
  description: "Information about Yabipa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className={`min-h-full ${poppins.className} bg-[#F7F8FC]`}>
        <SessionProvider>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
