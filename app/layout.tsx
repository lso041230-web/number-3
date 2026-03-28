import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 카피 문구 생성기",
  description: "원하는 분위기를 입력하면 스타일별 카피 문구 5개를 생성합니다.",
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
