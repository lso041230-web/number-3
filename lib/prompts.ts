export const STYLE_GUIDE = [
  { id: 1, style: "lyrical", title: "서정적" },
  { id: 2, style: "minimal", title: "담백한 문장" },
  { id: 3, style: "dreamy", title: "몽환적" },
  { id: 4, style: "warm", title: "따뜻한 위로" },
  { id: 5, style: "impactful", title: "짧고 강한 여운" },
] as const;

export function buildPoemPrompt(inputMood: string) {
  return `당신은 한국어 시 문장 작가입니다.

입력된 분위기: "${inputMood}"

요구사항:
- 한국어로만 작성하세요.
- 정확히 5개의 결과를 생성하세요.
- 각 결과는 1~2문장으로 작성하세요.
- 감정은 진솔하고 자연스럽게, 클리셰는 피하세요.
- 스타일 순서는 아래를 정확히 따르세요:
  1) lyrical / 서정적
  2) minimal / 담백한 문장
  3) dreamy / 몽환적
  4) warm / 따뜻한 위로
  5) impactful / 짧고 강한 여운
- 반드시 아래 JSON 스키마만 반환하세요. 설명 텍스트나 코드블록을 포함하지 마세요.

반환 스키마:
{
  "inputMood": "${inputMood}",
  "results": [
    { "id": 1, "style": "lyrical", "title": "서정적", "text": "string" },
    { "id": 2, "style": "minimal", "title": "담백한 문장", "text": "string" },
    { "id": 3, "style": "dreamy", "title": "몽환적", "text": "string" },
    { "id": 4, "style": "warm", "title": "따뜻한 위로", "text": "string" },
    { "id": 5, "style": "impactful", "title": "짧고 강한 여운", "text": "string" }
  ]
}`;
}
