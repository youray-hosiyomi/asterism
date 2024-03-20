import { DateUtil } from "@/common/utils/date.util";
import { SearchQueryHandler } from "@/common/utils/search-query";

export type Schedules_SearchQueryParams = {
  current?: Date;
};

export const schedules_searchQuery = new SearchQueryHandler<Schedules_SearchQueryParams>({
  toParams: (s) => {
    const current = s.get("current");
    return {
      current: current ? DateUtil.toDate(current) : undefined,
    };
  },
  toSearchInit: (p) => {
    return {
      current: p.current ? DateUtil.dateFormat(p.current, "YYYY-MM-DD") : "",
    };
  },
});
