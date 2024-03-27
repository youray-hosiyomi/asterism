/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from "@supabase/database.type";
import { SupabaseClient } from "@supabase/supabase-js";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastPromiseParams } from "react-toastify";

// Query

export type QueryApiFn<P, R> = (p: P) => Promise<R>;
export type QueryApiFind<Model, PrimaryParams> = QueryApiFn<PrimaryParams, Model | null>;
export type QueryApiList<Model, SearchParams> = QueryApiFn<SearchParams, Model[] | null>;

export interface QueryApiProps<Model, PrimaryParams, SearchParams> {
  /** キー */
  key: string;
  /** 単一のデータの取得 */
  find?: QueryApiFind<Model, PrimaryParams>;
  /** 複数のデータの取得 */
  list?: QueryApiList<Model, SearchParams>;
}

export class QueryApi<Model, PrimaryParams, SearchParams> {
  public key: string;
  private findFn?: QueryApiFind<Model, PrimaryParams>;
  private listFn?: QueryApiList<Model, SearchParams>;
  constructor(props: QueryApiProps<Model, PrimaryParams, SearchParams>) {
    this.key = props.key;
    this.findFn = props.find;
    this.listFn = props.list;
  }

  public async find(params: PrimaryParams): Promise<Model | null> {
    if (!this.findFn) throw Error("find method is undefined");
    return await this.findFn(params);
  }

  public async list(params: SearchParams): Promise<Model[] | null> {
    if (!this.listFn) throw Error("list method is undefined");
    return await this.listFn(params);
  }

  public useFind(params: PrimaryParams) {
    return this.useQ(params, (p) => this.find(p));
  }

  public useList(params: SearchParams) {
    return this.useQ(params, (p) => this.list(p));
  }

  protected useQ<P, Res>(params: P, fn: QueryApiFn<P, Res>) {
    return useQuery({
      queryKey: [this.key, params],
      queryFn: async () => {
        try {
          return await fn(params);
        } catch (e) {
          console.log(e);
          toast.error("Fetch Failure");
          throw e;
        }
      },
    });
  }
}

// Mutation

export type MutationApiFn<P, R = void> = (p: P) => Promise<R>;
export type MutationApiInsert<Model> = MutationApiFn<Model>;
export type MutationApiUpsert<Model> = MutationApiFn<Model>;
export type MutationApiUpdateParams<Model, PrimaryParams> = {
  params: PrimaryParams;
  req: Model;
};
export type MutationApiUpdate<Model, PrimaryParams> = MutationApiFn<MutationApiUpdateParams<Model, PrimaryParams>>;
export type MutationApiDelete<PrimaryParams> = MutationApiFn<PrimaryParams>;

export type MutationApiMultiProps<Model, PrimaryParams> = {
  insertList?: {
    req: Model;
  }[];
  upsertList?: {
    req: Model;
  }[];
  updateList?: {
    params: PrimaryParams;
    req: Model;
  }[];
  deleteList?: {
    params: PrimaryParams;
  }[];
};

export interface MutationApiProps<Model, PrimaryParams> {
  /** キー */
  key: string;
  /** 新規作成 */
  insert?: MutationApiInsert<Model>;
  /** 新規作成(存在する場合は更新) */
  upsert?: MutationApiUpsert<Model>;
  /** 更新 */
  update?: MutationApiUpdate<Model, PrimaryParams>;
  /** 削除 */
  delete?: MutationApiDelete<PrimaryParams>;
}

export class MutationApi<Model, PrimaryParams> {
  public key: string;
  private insertFn?: MutationApiInsert<Model>;
  private upsertFn?: MutationApiUpsert<Model>;
  private updateFn?: MutationApiUpdate<Model, PrimaryParams>;
  private deleteFn?: MutationApiDelete<PrimaryParams>;
  constructor(props: MutationApiProps<Model, PrimaryParams>) {
    this.key = props.key;
    this.insertFn = props.insert;
    this.upsertFn = props.upsert;
    this.updateFn = props.update;
    this.deleteFn = props.delete;
  }

  public async insert(req: Model): Promise<void> {
    if (!this.insertFn) throw Error("insert method is undefined");
    await this.insertFn(req);
  }

  public async upsert(req: Model): Promise<void> {
    if (!this.upsertFn) throw Error("upsert method is undefined");
    await this.upsertFn(req);
  }

  public async update({ params, req }: MutationApiUpdateParams<Model, PrimaryParams>): Promise<void> {
    if (!this.updateFn) throw Error("update method is undefined");
    await this.updateFn({ params, req });
  }

  public async delete(params: PrimaryParams): Promise<void> {
    if (!this.deleteFn) throw Error("delete method is undefined");
    await this.deleteFn(params);
  }

  public async multi({
    insertList,
    updateList,
    deleteList,
    upsertList,
  }: MutationApiMultiProps<Model, PrimaryParams>): Promise<void> {
    const inserts = insertList?.map(({ req }) => this.insert(req)) ?? [];
    const upserts = upsertList?.map(({ req }) => this.upsert(req)) ?? [];
    const updates = updateList?.map(({ req, params }) => this.update({ params, req })) ?? [];
    const deletes = deleteList?.map(({ params }) => this.delete(params)) ?? [];
    await Promise.all([...inserts, ...upserts, ...updates, ...deletes]);
  }

  public useInsert() {
    return this.useM<Model>((p) => this.insert(p));
  }

  public useUpsert() {
    return this.useM<Model>((p) => this.upsert(p));
  }

  public useUpdate() {
    return this.useM<MutationApiUpdateParams<Model, PrimaryParams>>((p) => this.update(p));
  }

  public useDelete() {
    return this.useM<PrimaryParams>((p) => this.delete(p));
  }

  public useMulti() {
    return this.useM<MutationApiMultiProps<Model, PrimaryParams>>((p) => this.multi(p));
  }

  protected useM<P, R = void>(fn: MutationApiFn<P, R>, params?: ToastPromiseParams) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: [this.key],
      mutationFn: async (p: P) => {
        return await toast.promise(
          fn(p),
          params ?? {
            success: "Success !",
            error: "Error !",
            pending: "Loading...",
          },
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [this.key],
          // exact: true
        });
      },
    });
  }
}

// Supabase

type Tables = Database["public"]["Tables"];

export type Schema<TableName extends keyof Tables> = Tables[TableName];
export type Row<TableName extends keyof Tables> = Schema<TableName>["Row"];
export type Insert<TableName extends keyof Tables> = Schema<TableName>["Insert"];
export type Update<TableName extends keyof Tables> = Schema<TableName>["Update"];
export type Relationships<TableName extends keyof Tables> = Schema<TableName>["Relationships"];
export type FilterBuilder<TableName extends keyof Tables> = PostgrestFilterBuilder<
  Database["public"],
  Row<TableName>,
  Row<TableName>[]
>;
export type FilterHandler<TableName extends keyof Tables, SearchParams> = (
  prev: FilterBuilder<TableName>,
  searchParams: SearchParams,
) => FilterBuilder<TableName>;
export type ApiHandlerConfig<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Schema<TableName>["Row"],
  SearchParams,
> = {
  tableName: TableName;
  primaryKeys: PrimaryKey[];
  handlers: (FilterHandler<TableName, SearchParams> | null | undefined)[];
};
export type PrimaryParams<TableName extends keyof Tables, PrimaryKey extends keyof Schema<TableName>["Row"]> = Pick<
  Schema<TableName>["Row"],
  PrimaryKey
>;

export abstract class ApiHandler<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Schema<TableName>["Row"],
  SearchParams,
> {
  protected supabase: SupabaseClient<Database>;
  protected tableName: TableName;
  protected primaryKeys: PrimaryKey[];
  protected handlers: (FilterHandler<TableName, SearchParams> | null | undefined)[] = [];

  public query: QueryApi<Row<TableName>, PrimaryParams<TableName, PrimaryKey>, SearchParams>;
  public mutation: MutationApi<Insert<TableName>, PrimaryParams<TableName, PrimaryKey>>;

  constructor(supabase: SupabaseClient<Database>, c: ApiHandlerConfig<TableName, PrimaryKey, SearchParams>) {
    this.supabase = supabase;
    this.tableName = c.tableName;
    this.primaryKeys = c.primaryKeys;
    this.handlers = c.handlers;
    this.query = new QueryApi(this.queryProps());
    this.mutation = new MutationApi(this.mutationProps());
  }

  async list(searchParams?: SearchParams) {
    const res = searchParams
      ? await this.handlers.reduce((prev, handler) => {
          if (handler) {
            return handler(prev, searchParams);
          } else {
            return prev;
          }
        }, this.db().select() as FilterBuilder<TableName>)
      : await this.db().select();
    if (res.error) {
      throw res.error;
    }
    return res.data as Row<TableName>[];
  }

  async find(primaryParams: PrimaryParams<TableName, PrimaryKey>) {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().select()).maybeSingle();
    if (res.error) {
      throw res.error;
    }
    return res.data as Row<TableName> | null;
  }

  async insert(req: Insert<TableName>) {
    const res = await this.db().insert(req as any);
    if (res.error) {
      throw res.error;
    }
  }

  async upsert(req: Insert<TableName>) {
    const res = await this.db().upsert(req as any);
    if (res.error) {
      throw res.error;
    }
  }

  async update(primaryParams: PrimaryParams<TableName, PrimaryKey>, req: Update<TableName>) {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().update(req as any) as any);
    if (res.error) {
      throw res.error;
    }
  }

  async delete(primaryParams: PrimaryParams<TableName, PrimaryKey>) {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().delete() as any);
    if (res.error) {
      throw res.error;
    }
  }

  queryProps(): QueryApiProps<Row<TableName>, PrimaryParams<TableName, PrimaryKey>, SearchParams> {
    return {
      key: this.tableName,
      list: (p) => this.list(p),
      find: (p) => this.find(p),
    };
  }

  mutationProps(): MutationApiProps<Insert<TableName>, PrimaryParams<TableName, PrimaryKey>> {
    return {
      key: this.tableName,
      insert: (p) => this.insert(p),
      upsert: (p) => this.upsert(p),
      update: ({ params, req }) => this.update(params, req),
      delete: (p) => this.delete(p),
    };
  }

  protected filterHandlerByPrimaryParams(
    primaryParams: PrimaryParams<TableName, PrimaryKey>,
    prevBuilder: FilterBuilder<TableName>,
  ): FilterBuilder<TableName> {
    return this.primaryKeys.reduce((prev, key) => {
      return prev.eq(key as any, primaryParams[key as PrimaryKey] as any);
    }, prevBuilder);
  }

  protected db() {
    return this.supabase.from(this.tableName);
  }
}
