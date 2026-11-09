"use client";
// Menyimpan pilihan tema (gelap/terang) dan memasang class "dark" di <html>.
import { ThemeProvider as NextThemes } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
