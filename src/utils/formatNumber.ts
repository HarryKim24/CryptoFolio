const formatNumberForDisplay = (value: number): string => {
  if (isNaN(value)) {
    return '-';
  }

  const stringValue = value.toString();
  const splitValues = stringValue.split('.');
  const integerRaw = splitValues[0];
  const fractionRaw = splitValues[1] ?? '';

  const integerNumber = Number(integerRaw);
  const integerFormatted = integerNumber.toLocaleString('ko-KR');

  const hasLargeInteger = integerRaw.length >= 6;
  if (hasLargeInteger) {
    return integerFormatted;
  }

  const hasFraction = fractionRaw.length > 0;

  if (integerNumber > 0) {
    const maxFractionLength = 6 - integerRaw.length;

    if (hasFraction) {
      const slicedFraction = fractionRaw.slice(0, maxFractionLength);
      const formatted = `${integerFormatted}.${slicedFraction}`;
      return formatted;
    }

    return integerFormatted;
  }

  let trimmedFraction = fractionRaw.slice(0, 6);

  const fractionPattern = /0*(\d{3,})/;
  const match = fractionRaw.match(fractionPattern);

  if (match) {
    const matched = match[0];
    const limited = matched.slice(0, 6);
    trimmedFraction = limited;
  }

  const formattedZero = `0.${trimmedFraction}`;
  return formattedZero;
};

const formatPrice = (value: number): string => {
  if (isNaN(value)) {
    return '-';
  }

  const floored = Math.floor(value);
  const formatted = floored.toLocaleString('ko-KR');
  return formatted;
};

export { formatNumberForDisplay, formatPrice };