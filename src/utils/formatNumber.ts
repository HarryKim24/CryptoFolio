export const formatNumberForDisplay = (value: number): string => {
  if (isNaN(value)) return '-'

  const [intPart, fracPart = ''] = value.toString().split('.')

  const intPartFormatted = Number(intPart).toLocaleString('ko-KR')

  if (intPart.length >= 6) {
    return intPartFormatted
  }

  if (parseInt(intPart) > 0) {
    const allowedFracLength = Math.max(0, 6 - intPart.length)
    return fracPart
      ? `${intPartFormatted}.${fracPart.slice(0, allowedFracLength)}`
      : intPartFormatted
  }

  let trimmedFrac = fracPart.slice(0, 6)

  const match = fracPart.match(/0*(\d{3,})/)
  if (match) {
    trimmedFrac = match[0].slice(0, 6)
  }

  return `0.${trimmedFrac}`
}

export const formatPrice = (value: number): string => {
  if (isNaN(value)) return '-'
  return Math.floor(value).toLocaleString('ko-KR')
}