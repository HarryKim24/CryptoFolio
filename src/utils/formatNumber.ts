export const formatNumberForDisplay = (value: number): string => {
  const [intPart, fracPart = ''] = value.toString().split('.')

  if (intPart.length >= 6) {
    return intPart
  }

  if (parseInt(intPart) > 0) {
    const allowedFracLength = Math.max(0, 6 - intPart.length)
    return fracPart
      ? `${intPart}.${fracPart.slice(0, allowedFracLength)}`
      : intPart
  }

  let trimmedFrac = fracPart.slice(0, 6)

  const match = fracPart.match(/0*(\d{3,})/)
  if (match) {
    trimmedFrac = match[0].slice(0, 6)
  }

  return `0.${trimmedFrac}`
}
