import Navbar from "@/components/navbar";
import SignInRequired from "@/components/sign-in-required";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getSession } from "@/lib/roles";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Operations App",
  description: "Operations App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await getSession();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${fontSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="bottom-left" closeButton />

          <ClerkProvider>
            <Navbar />
            {/* Hides pages from signed-out visitors, but does NOT keep their
                data from being sent: that is proxy.ts and each page's own
                check */}
            {isAuthenticated ? children : <SignInRequired />}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
