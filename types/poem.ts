export type PoemStyle = "lyrical" | "minimal" | "dreamy" | "warm" | "impactful";

export type PoemResult = {
  id: 1 | 2 | 3 | 4 | 5;
  style: PoemStyle;
  title: string;
  text: string;
};

export type GenerateResponse = {
  inputMood: string;
  results: PoemResult[];
};
