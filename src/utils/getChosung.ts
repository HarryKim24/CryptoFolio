const CHO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ",
  "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ",
  "ㅌ", "ㅍ", "ㅎ",
];

export const getChosung = (text: string) => {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0) - 44032;
      if (code >= 0 && code <= 11171) {
        const choIndex = Math.floor(code / 588);
        return CHO[choIndex];
      }
      return char;
    })
    .join("");
};