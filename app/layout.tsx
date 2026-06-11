import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getSession } from "@/lib/roles";
import { ClerkProvider, Show, SignInButton } from "@clerk/nextjs";
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
  const { isAuthenticated, isAdmin } = await getSession();

  return (
    <html lang="en" dir="rtl" suppressHydrationWarning>
      <body className={`${fontSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="bottom-left" closeButton />

          <ClerkProvider>
            <Navbar isAdmin={isAdmin} />
            {isAuthenticated ? (
              children
            ) : (
              <div className="container mx-auto text-center font-bold text-3xl">
                قم{" "}
                <Show when="signed-out">
                  <SignInButton>
                    <Button
                      variant={"link"}
                      size={"lg"}
                      className="text-3xl px-0 text-orange-400"
                    >
                      بتسجيل الدخول
                    </Button>
                  </SignInButton>
                </Show>{" "}
                حتى تستطيع ان تكمل
              </div>
            )}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
