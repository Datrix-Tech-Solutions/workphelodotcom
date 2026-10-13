import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workphelo",
  description: "Website for Workphelo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
