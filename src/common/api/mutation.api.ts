/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastPromiseParams, toast } from "react-toastify";

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
  /** モデル名 */
  modelName?: string;
  /** 新規作成 */
  insert?: MutationApiInsert<Model>;
  /** 新規作成(存在する場合は更新) */
  upsert?: MutationApiUpsert<Model>;
  /** 更新 */
  update?: MutationApiUpdate<Model, PrimaryParams>;
  /** 削除 */
  delete?: MutationApiDelete<PrimaryParams>;
}

export abstract class MutationApi<Model, PrimaryParams> {
  public key: string;
  public modelName?: string;
  private insertFn?: MutationApiInsert<Model>;
  private upsertFn?: MutationApiUpsert<Model>;
  private updateFn?: MutationApiUpdate<Model, PrimaryParams>;
  private deleteFn?: MutationApiDelete<PrimaryParams>;
  constructor(props: MutationApiProps<Model, PrimaryParams>) {
    this.key = props.key;
    this.modelName = props.modelName;
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
