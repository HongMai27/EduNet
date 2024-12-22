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
      return minutesAgo === 0 ? "Just now" : `${minutesAgo} minutes`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours`;
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else {
      return `${daysAgo} day ago`;
    }
  };

  return { formatTimestamp };
};

export default useFormattedTimestamp;
