import { Range } from "@/common/type/range.type";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@supabase/database.type";
import { DateUtil } from "@/common/utils/date.util";
import { supabase } from "@/common/utils/supabase.util";
import { ApiHandler, Schema } from "@/common/utils/api.util";

export type Schedule_Schema = Schema<"schedules">;
export type Schedule = Schedule_Schema["Row"];
export type Schedule_Req = Schedule_Schema["Insert"];

export type ScheduleKind =
  | "important=true&emergency=true"
  | "important=true&emergency=false"
  | "important=false&emergency=true"
  | "important=false&emergency=false";

export type ScheduleStatus = "completed" | "incompleted";

export type ScheduleSearchParams = {
  orderAscending: boolean;
  kind?: ScheduleKind;
  status?: ScheduleStatus;
  isImportant?: boolean;
  isEmergency?: boolean;
  title?: string;
  range?: Range<Date>;
};

type SchedulePrimaryKey = "id";

export class ScheduleApi extends ApiHandler<"schedules", SchedulePrimaryKey, ScheduleSearchParams> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, {
      tableName: "schedules",
      primaryKeys: ["id"],
      handlers: [
        (prevBuilder, params) => {
          return prevBuilder
            .order("plan_from_at", { ascending: params.orderAscending })
            .order("plan_to_at", { ascending: params.orderAscending });
        },
        (prevBuilder, params) => {
          if (params.range) {
            return prevBuilder
              .gte("plan_to_at", DateUtil.date2timestamp(params.range.from))
              .lt("plan_from_at", DateUtil.date2timestamp(params.range.to));
          }
          return prevBuilder;
        },
        (prevBuilder, params) => {
          if (params.title) {
            return prevBuilder.eq("title", params.title);
          }
          return prevBuilder;
        },
        (prevBuilder, params) => {
          if (params.isImportant !== undefined) {
            return prevBuilder.eq("is_important", params.isImportant);
          } else if (params.kind !== undefined) {
            switch (params.kind) {
              case "important=true&emergency=true":
                return prevBuilder.eq("is_important", true);
              case "important=true&emergency=false":
                return prevBuilder.eq("is_important", true);
              case "important=false&emergency=true":
                return prevBuilder.eq("is_important", false);
              case "important=false&emergency=false":
                return prevBuilder.eq("is_important", false);
            }
          }
          return prevBuilder;
        },
        (prevBuilder, params) => {
          if (params.isEmergency !== undefined) {
            return prevBuilder.eq("is_emergency", params.isEmergency);
          } else if (params.kind !== undefined) {
            switch (params.kind) {
              case "important=true&emergency=true":
                return prevBuilder.eq("is_emergency", true);
              case "important=true&emergency=false":
                return prevBuilder.eq("is_emergency", false);
              case "important=false&emergency=true":
                return prevBuilder.eq("is_emergency", true);
              case "important=false&emergency=false":
                return prevBuilder.eq("is_emergency", false);
            }
          }
          return prevBuilder;
        },
        (prevBuilder, params) => {
          if (params.status == "completed") {
            return prevBuilder.not("completed_at", "is", null);
          } else if (params.status == "incompleted") {
            return prevBuilder.is("completed_at", null);
          }
          return prevBuilder;
        },
      ],
    });
  }
  empty(userId: string): Schedule_Req {
    return {
      user_id: userId,
      title: "",
      detail: "",
      plan_from_at: DateUtil.date2timestamp(new Date()),
      plan_to_at: DateUtil.date2timestamp(new Date()),
      is_important: false,
      is_emergency: false,
      is_all_day: false,
    };
  }
}

export const scheduleApi: ScheduleApi = new ScheduleApi(supabase);
