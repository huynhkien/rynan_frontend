import type { Metadata } from "next";
import { ThemeProvider } from "@/app/_providers";
import utmAvo from "@/shared/configs/font";

// import swiper css
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export const metadata: Metadata = {
  title: "Rynan Smart Agriculture",
  description: "Rynan Smart Agriculture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={utmAvo.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
