import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import SyncUserProvider from "@/providers/SyncUserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terior",
  description:
    "Instantly transform any room with Terior, the AI-powered room redesign app. Simply upload a photo and let our AI create stunning, personalized interior design concepts. Whether you're decorating a living room, bedroom, or office, Terior provides endless design inspiration, from modern minimalism to cozy bohemian. Get a glimpse of your dream home without the hassle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          logoImageUrl: "/logo-short.png",
          socialButtonsVariant: "iconButton",
        },
        variables: { colorPrimary: "#ffa500" },
      }}
    >
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SyncUserProvider>{children}</SyncUserProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
