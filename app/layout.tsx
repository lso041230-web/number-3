import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mood to Poem",
  description: "감정 한 줄을 시적인 문장으로 변환하는 앱",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
