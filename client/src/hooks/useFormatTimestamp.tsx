import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { vi } from "date-fns/locale";

const useFormattedTimestamp = () => {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const minutesAgo = differenceInMinutes(now, date);
    const hoursAgo = differenceInHours(now, date);
    const daysAgo = differenceInDays(now, date);

    if (minutesAgo < 60) {
      return minutesAgo === 0 ? "Just now" : `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
    } else if (daysAgo < 1) {
      return "Today";
    } else {
      return format(date, "dd-MM 'at' HH:mm", { locale: vi });
    }
  };

  return { formatTimestamp };
};

export default useFormattedTimestamp;
