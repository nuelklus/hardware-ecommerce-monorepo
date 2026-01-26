import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CartDebug } from "@/components/debug/CartDebug";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hardware E-commerce",
  description: "Hardware E-commerce storefront",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDebug />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
