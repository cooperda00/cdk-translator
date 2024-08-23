import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export const formatDate = (ts: number) => {
  return dayjs(ts).format("dddd Do MMMM, YYYY");
};
