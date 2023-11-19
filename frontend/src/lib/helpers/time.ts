export const formatTime = (seconds: number): string => {
  if (seconds <= 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const secondsLeftovers = seconds - minutes * 60;

  if (minutes <= 60) return `${minutes}m ${secondsLeftovers > 0 ? `${secondsLeftovers}s` : ''}`;

  const hours = Math.floor(minutes / 60);
  const minutesLeftovers = minutes - hours * 60;

  return `${hours}h ${minutesLeftovers > 0 ? `${minutesLeftovers}m` : ''} ${
    secondsLeftovers > 0 ? `${secondsLeftovers}s` : ''
  }`;
};
