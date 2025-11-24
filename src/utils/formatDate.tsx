const formatDate = (isoString?: string): string => {
  if (!isoString) {
    return '-';
  }

  if (typeof isoString !== 'string') {
    return '-';
  }

  const date = new Date(isoString);
  const time = date.getTime();

  if (isNaN(time)) {
    return '-';
  }

  const year = date.getFullYear();

  const rawMonth = date.getMonth() + 1;
  const month = String(rawMonth).padStart(2, '0');

  const rawDay = date.getDate();
  const day = String(rawDay).padStart(2, '0');

  const rawHour = date.getHours();
  const hour = String(rawHour).padStart(2, '0');

  const rawMinute = date.getMinutes();
  const minute = String(rawMinute).padStart(2, '0');

  const formatted = `${year}. ${month}. ${day}. ${hour}:${minute}`;
  return formatted;
};

export { formatDate };