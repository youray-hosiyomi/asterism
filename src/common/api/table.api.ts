/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PFBuilderHandler,
  makePFBuilderByPrimaryParams,
  makePFBuilderBySearchParams,
} from "@/common/utils/supabase.util";
import { QueryApiFind, QueryApiList, QueryApiProps } from "@/common/api/query.api";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  MutationApiDelete,
  MutationApiInsert,
  MutationApiProps,
  MutationApiUpdate,
  MutationApiUpsert,
} from "@/common/api/mutation.api";
import { Database } from "@supabase/database.type";

type Tables = Database["public"]["Tables"];

export interface STApiProps<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Tables[TableName]["Row"],
  Model,
  SearchParams,
> {
  tName: TableName;
  modelName?: string;
  primaryKeys: PrimaryKey[];
  row2model: (row: Tables[TableName]["Row"]) => Model;
  model2insert: (model: Model) => Tables[TableName]["Insert"];
  model2update?: (model: Model) => Tables[TableName]["Update"];
  searchHandlers?: PFBuilderHandler<SearchParams, Tables[TableName]["Row"]>[];
}

export abstract class STApi<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Tables[TableName]["Row"],
  PrimaryParams extends {
    [key in PrimaryKey]: string | number;
  },
  Model = Tables[TableName]["Row"],
  SearchParams = Record<string, never>,
> {
  protected supabase: SupabaseClient<Database>;

  protected tName: TableName;
  protected modelName?: string;
  protected primaryKeys: PrimaryKey[];
  protected row2model: (row: Tables[TableName]["Row"]) => Model;
  protected model2insert: (model: Model) => Tables[TableName]["Insert"];
  protected model2update?: (model: Model) => Tables[TableName]["Update"];
  protected searchHandlers: PFBuilderHandler<SearchParams, Tables[TableName]["Row"]>[];

  constructor(supabase: SupabaseClient<Database>, props: STApiProps<TableName, PrimaryKey, Model, SearchParams>) {
    this.supabase = supabase;
    this.tName = props.tName;
    this.modelName = props.modelName;
    this.primaryKeys = props.primaryKeys;
    this.row2model = props.row2model;
    this.model2insert = props.model2insert;
    this.model2update = props.model2update;
    this.searchHandlers = props.searchHandlers ?? [];
  }

  // === make props =======

  public queryProps(): QueryApiProps<Model, PrimaryParams, SearchParams> {
    return {
      key: this.tName,
      modelName: this.modelName,
      find: (p) => this.find(p),
      list: (p) => this.list(p),
    };
  }

  public mutationProps(): MutationApiProps<Model, PrimaryParams> {
    return {
      key: this.tName,
      modelName: this.modelName,
      insert: (p) => this.insert(p),
      upsert: (p) => this.upsert(p),
      update: (p) => this.update(p),
      delete: (p) => this.delete(p),
    };
  }

  // === query =======

  public find: QueryApiFind<Model, PrimaryParams> = async (params) => {
    const res = await makePFBuilderByPrimaryParams<TableName, PrimaryKey, PrimaryParams>(
      params,
      this.db().select(),
    ).maybeSingle();
    if (res.data) {
      return this.row2model(res.data);
    } else {
      return null;
    }
  };

  public list: QueryApiList<Model, SearchParams> = async (params) => {
    const res = await makePFBuilderBySearchParams<SearchParams, Tables[TableName]["Row"]>(
      params,
      this.db().select(),
      this.searchHandlers,
    );
    if (res.data) {
      return res.data.map((row) => this.row2model(row));
    } else {
      return [];
    }
  };

  // === mutation ======

  public insert: MutationApiInsert<Model> = async (req: Model) => {
    const res = await this.db().insert(this.model2insert(req) as any);
    if (res.error) {
      throw res.error;
    }
  };

  public upsert: MutationApiUpsert<Model> = async (req: Model) => {
    const res = await this.db().upsert(this.model2insert(req) as any, {
      onConflict: this.primaryKeys.join(", "),
    });
    if (res.error) {
      throw res.error;
    }
  };

  public update: MutationApiUpdate<Model, PrimaryParams> = async ({ params, req }) => {
    const res = await makePFBuilderByPrimaryParams<TableName, PrimaryKey, PrimaryParams, null>(
      params,
      this.db().update(this.model2update ? this.model2update(req) : (this.model2insert(req) as any)),
    );
    if (res.error) {
      throw res.error;
    }
  };

  public delete: MutationApiDelete<PrimaryParams> = async (params) => {
    const res = await makePFBuilderByPrimaryParams<TableName, PrimaryKey, PrimaryParams, null>(
      params,
      this.db().delete(),
    );
    if (res.error) {
      throw res.error;
    }
  };

  // === utils =======

  public db() {
    return this.supabase.from(this.tName);
  }
}
