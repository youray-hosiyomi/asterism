import { Database } from "@supabase/database.type";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type FilterBuilder<Row extends Record<string, unknown>, Result = Row[]> = PostgrestFilterBuilder<
  Database["public"],
  Row,
  Result
>;

export type PFBuilderHandler<SearchParams, Row extends Record<string, unknown>, Result = Row[]> = (
  params: SearchParams,
  prevBuilder: FilterBuilder<Row, Result>,
) => FilterBuilder<Row, Result>;

export function makePFBuilderBySearchParams<SearchParams, Row extends Record<string, unknown>, Result = Row[]>(
  params: SearchParams,
  prevBuilder: FilterBuilder<Row, Result>,
  handlers: PFBuilderHandler<SearchParams, Row, Result>[],
): FilterBuilder<Row, Result> {
  return handlers.reduce((prev, handler) => {
    return handler(params, prev);
  }, prevBuilder);
}

export type SupabaseTableName = keyof Database["public"]["Tables"];
export type SupabasePrimaryKey<TableName extends SupabaseTableName> =
  keyof Database["public"]["Tables"][TableName]["Row"];

export type Client = SupabaseClient<Database>;

export function makePFBuilderByPrimaryParams<
  TableName extends SupabaseTableName,
  PrimaryKey extends SupabasePrimaryKey<TableName>,
  PrimaryParams extends {
    [key in PrimaryKey]: string | number;
  },
  Result = Database["public"]["Tables"][TableName]["Row"][],
>(
  params: PrimaryParams,
  prevBuilder: FilterBuilder<Database["public"]["Tables"][TableName]["Row"], Result>,
): FilterBuilder<Database["public"]["Tables"][TableName]["Row"], Result> {
  return Object.keys(params).reduce((prev, key) => {
    return prev.eq(key, params[key as keyof PrimaryParams]);
  }, prevBuilder);
}
