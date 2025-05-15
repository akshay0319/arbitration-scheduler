export function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getWeekDays(startDate: Date) {
  const start = new Date(startDate);
  const week = [];
  start.setDate(start.getDate() - start.getDay()); // Sunday
  for (let i = 0; i < 7; i++) {
    week.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return week;
}

export function getHoursForDay() {
  const hours = [];
  for (let h = 9; h <= 18; h++) {
    hours.push(`${h}:00`);
  }
  return hours;
}
