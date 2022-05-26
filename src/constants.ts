import dayjs from "dayjs";

export const PERIODS = {
  day: {
    start: dayjs(new Date()).startOf("day").toString(),
    end: dayjs(new Date()).endOf("day").toString(),
  },
  week: {
    start: dayjs(new Date()).startOf("week").toString(),
    end: dayjs(new Date()).endOf("week").toString(),
  },
  month: {
    start: dayjs(new Date()).startOf("month").toString(),
    end: dayjs(new Date()).endOf("month").toString(),
  },
  year: {
    start: dayjs(new Date()).startOf("year").toString(),
    end: dayjs(new Date()).endOf("year").toString(),
  },
};
