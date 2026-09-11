import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { TextSizeProvider } from "../context/TextSizeContext";

export const metadata: Metadata = {
  title: "JanSetu AI — From Citizen Voice to Government Action",
  description: "AI-Powered Citizen Grievance Intelligence & Resolution Platform for Pune Municipal Corporation (PMC)",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          <TextSizeProvider>
            {children}
          </TextSizeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

