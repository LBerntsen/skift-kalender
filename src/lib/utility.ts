export function parseTime(aTimeString: string)
{
  const timeParts = aTimeString.split(":");
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
}

export function formatTime(aTimeNumber: number)
{
  const minutes = aTimeNumber % 60;
  const hours = (aTimeNumber - minutes) / 60

  const minutesString = minutes > 9 ? minutes.toString() : `0${minutes.toString()}`;
  const hoursString = hours > 9 ? hours.toString() : `0${hours.toString()}`;

  return `${hoursString}:${minutesString}`;
}