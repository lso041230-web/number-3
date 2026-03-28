export type CopyStyle = "감성형" | "직관형" | "프리미엄형" | "트렌디형" | "미니멀형";

export type CopyResult = {
  id: string;
  style: CopyStyle;
  headline: string;
  description: string;
};

export type GenerateCopyResponse = {
  mood: string;
  results: CopyResult[];
};
