import { Range } from "@/common/type/range.type";
import { makeUUID } from "@/common/utils/uid.util";
import { STApi } from "../../common/api/table.api";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@supabase/database.type";
import { StringUtil } from "@/common/utils/string.util";
import { DateUtil } from "@/common/utils/date.util";
import { MutationApi } from "../../common/api/mutation.api";
import { QueryApi } from "../../common/api/query.api";
import { supabase } from "@/common/utils/supabase.util";

export type Schedule = {
  id: string;
  userId: string;
  title: string;
  detail: string;
  planAt: Range<Date>;
  completedAt?: Date;
  isImportant: boolean;
  isEmergency: boolean;
  isNew?: boolean;
};

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
type SchedulePrimaryParams = { id: string };

export class ScheduleApi extends STApi<
  "schedules",
  SchedulePrimaryKey,
  SchedulePrimaryParams,
  Schedule,
  ScheduleSearchParams
> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, {
      tName: "schedules",
      primaryKeys: ["id"],
      row2model: (row) => {
        return {
          id: row.id,
          userId: row.user_id,
          title: row.title,
          detail: row.detail ?? "",
          planAt: {
            from: DateUtil.timestamp2date(row.plan_from_at),
            to: DateUtil.timestamp2date(row.plan_to_at),
          },
          completedAt: row.completed_at ? DateUtil.timestamp2date(row.completed_at) : undefined,
          isImportant: row.is_important,
          isEmergency: row.is_emergency,
        };
      },
      model2insert: (model) => {
        return {
          id: model.id,
          user_id: model.userId,
          title: model.title,
          detail: StringUtil.empty2null(model.detail),
          plan_from_at: DateUtil.date2timestamp(model.planAt.from),
          plan_to_at: DateUtil.date2timestamp(model.planAt.to),
          completed_at: model.completedAt ? DateUtil.date2timestamp(model.completedAt) : null,
          is_important: model.isImportant,
          is_emergency: model.isEmergency,
        };
      },
      searchHandlers: [
        (params, prevBuilder) => {
          return prevBuilder
            .order("plan_from_at", { ascending: params.orderAscending })
            .order("plan_to_at", { ascending: params.orderAscending });
        },
        (params, prevBuilder) => {
          if (params.range) {
            return prevBuilder
              .gte("plan_to_at", DateUtil.date2timestamp(params.range.from))
              .lt("plan_from_at", DateUtil.date2timestamp(params.range.to));
          }
          return prevBuilder;
        },
        (params, prevBuilder) => {
          if (params.title) {
            return prevBuilder.eq("title", params.title);
          }
          return prevBuilder;
        },
        (params, prevBuilder) => {
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
        (params, prevBuilder) => {
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
        (params, prevBuilder) => {
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
}

export class ScheduleQueryApi extends QueryApi<Schedule, SchedulePrimaryParams, ScheduleSearchParams> {
  constructor(supabase: SupabaseClient<Database>) {
    const api = new ScheduleApi(supabase);
    super(api.queryProps());
  }
}

export class ScheduleMutationApi extends MutationApi<Schedule, SchedulePrimaryParams> {
  constructor(supabase: SupabaseClient<Database>) {
    const api = new ScheduleApi(supabase);
    super(api.mutationProps());
  }
  empty(userId: string): Schedule {
    return {
      id: makeUUID(),
      userId,
      title: "",
      detail: "",
      planAt: {
        from: new Date(),
        to: new Date(),
      },
      isImportant: false,
      isEmergency: false,
      isNew: true,
    };
  }
}

export const scheduleApi: ScheduleApi = new ScheduleApi(supabase);
export const scheduleQueryApi: ScheduleQueryApi = new ScheduleQueryApi(supabase);
export const scheduleMutationApi: ScheduleMutationApi = new ScheduleMutationApi(supabase);
