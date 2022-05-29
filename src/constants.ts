import dayjs from "dayjs";

export const PERIODS = {
  day: {
    start: dayjs().startOf("day").toJSON(),
    end: dayjs().endOf("day").toJSON(),
  },
  week: {
    start: dayjs().startOf("week").toJSON(),
    end: dayjs().endOf("week").toJSON(),
  },
  month: {
    start: dayjs().startOf("month").toJSON(),
    end: dayjs().endOf("month").toJSON(),
  },
  year: {
    start: dayjs().startOf("year").toJSON(),
    end: dayjs().endOf("year").toJSON(),
  },
};
