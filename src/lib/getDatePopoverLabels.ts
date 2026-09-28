import { dateFormatterDefaults, timeFormatterDefaults } from "@/lib/constants";
import getRelativeDateString from "@/lib/getRelativeDateString";

export default function getDatePopoverLabels(date: Date) {
  return {
    relative: getRelativeDateString(date),
    absolute: `${date.toLocaleDateString("ru", dateFormatterDefaults)} в ${date.toLocaleTimeString("ru", timeFormatterDefaults)}`,
  };
}
