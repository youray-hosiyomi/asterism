import dayjs from "dayjs";

export class DateUtil {
  static toDate = (str: string): Date => {
    return dayjs(str).toDate();
  };
  static timestamp2date = (timestamp: string): Date => {
    return dayjs(timestamp).toDate();
  };
  static date2yyyymmdd = (date: Date): string => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  static date2yyyymmddhhmm = (date: Date): string => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm");
  };
  static date2timestamp = (date: Date): string => {
    return dayjs(date).toISOString();
  };
  static dateFormat = (date: Date | null, template: string): string => {
    if (!date) {
      return "";
    }
    return dayjs(date).format(template);
  };
  static timestamp2yyyymmddhhmm = (timestamp: string): string => {
    return DateUtil.date2yyyymmddhhmm(DateUtil.timestamp2date(timestamp));
  };
  static yyyymmddhhmm2timestamp = (yyyymmddhhmm: string): string => {
    return DateUtil.date2timestamp(DateUtil.timestamp2date(yyyymmddhhmm));
  };
  static addDate = (date: Date, count: number): Date => {
    const dj = dayjs(date).add(count, "day");
    return dj.toDate();
  };
}
