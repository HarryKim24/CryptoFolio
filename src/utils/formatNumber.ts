const formatNumberForDisplay = (value: number): string => {
  if (isNaN(value)) return '-';

  const [intPartRaw, fracPartRaw = ''] = value.toString().split('.');
  const intPartNum = Number(intPartRaw);
  const intPartFormatted = intPartNum.toLocaleString('ko-KR');

  if (intPartRaw.length >= 6) {
    return intPartFormatted;
  }

  if (intPartNum > 0) {
    const allowedFracLength = Math.max(0, 6 - intPartRaw.length);
    return fracPartRaw
      ? `${intPartFormatted}.${fracPartRaw.slice(0, allowedFracLength)}`
      : intPartFormatted;
  }

  let trimmedFrac = fracPartRaw.slice(0, 6);
  const match = fracPartRaw.match(/0*(\d{3,})/);
  if (match) {
    trimmedFrac = match[0].slice(0, 6);
  }

  return `0.${trimmedFrac}`;
};

const formatPrice = (value: number): string => {
  if (isNaN(value)) return '-';
  return Math.floor(value).toLocaleString('ko-KR');
};

export { formatNumberForDisplay, formatPrice };