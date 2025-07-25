import type { Metadata } from "next";
import { ModalProvider, ReduxProvider, ThemeProvider, ToastProvider, } from "@/app/_providers";
import utmAvo from "@/shared/configs/font";

// import swiper css
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AutoLogoutWrapper } from "./_providers/logout-provider";
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
          <ReduxProvider>
            <ThemeProvider>
              <ToastProvider />
              <ModalProvider>
                <AutoLogoutWrapper>
                {children}
                </AutoLogoutWrapper>
              </ModalProvider>
            </ThemeProvider>
          </ReduxProvider>
          
      </body>
    </html>
  );
}
