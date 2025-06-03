export default function formatDateTime(date: string) {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth();
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  const time = `${hours}:${minutes}`;

  const today = new Date();
  const isToday =
    today.getDay() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  return { day, time, isToday };
}
