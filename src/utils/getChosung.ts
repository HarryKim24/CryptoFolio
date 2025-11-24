const CHO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ",
  "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ",
  "ㅌ", "ㅍ", "ㅎ",
];

const getChosung = (text: string): string => {
  const characters = text.split('');
  const result: string[] = [];

  for (const char of characters) {
    const rawCode = char.charCodeAt(0);
    const hangulBase = 44032;
    const hangulEnd = 11171;

    const code = rawCode - hangulBase;

    const isHangul = code >= 0 && code <= hangulEnd;

    if (isHangul) {
      const index = Math.floor(code / 588);
      const chosung = CHO[index];
      result.push(chosung);
    } else {
      result.push(char);
    }
  }

  const joined = result.join('');
  return joined;
};

export { getChosung };