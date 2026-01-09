import { format } from "date-fns";

/**
 * 将 Date 对象格式化为 HH:mm 格式
 */
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

/**
 * 解析时间字符串为 Date 对象
 */
export function parseTime(timeStr: string, defaultDate: Date): Date {
  if (!timeStr) return defaultDate;
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return defaultDate;
  const date = new Date(defaultDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}
