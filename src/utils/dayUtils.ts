import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export const formatDateTime = (dateString: string, format: string = 'DD/MM/YYYY HH:mm') => {
  return dayjs(dateString).tz(VIETNAM_TZ).format(format);
};

export const formatTime = (dateString: string) => {
  return dayjs(dateString).tz(VIETNAM_TZ).format('HH:mm');
};

export const formatDate = (dateString: string) => {
  return dayjs(dateString).tz(VIETNAM_TZ).format('DD/MM/YYYY');
};