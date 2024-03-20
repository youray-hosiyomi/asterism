/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type QueryApiFn<P, R> = (p: P) => Promise<R>;
export type QueryApiFind<Model, PrimaryParams> = QueryApiFn<PrimaryParams, Model | null>;
export type QueryApiList<Model, SearchParams> = QueryApiFn<SearchParams, Model[] | null>;

export interface QueryApiProps<Model, PrimaryParams, SearchParams> {
  /** キー */
  key: string;
  /** モデル名 */
  modelName?: string;
  /** 単一のデータの取得 */
  find?: QueryApiFind<Model, PrimaryParams>;
  /** 複数のデータの取得 */
  list?: QueryApiList<Model, SearchParams>;
}

export abstract class QueryApi<Model, PrimaryParams, SearchParams> {
  public key: string;
  public modelName?: string;
  private findFn?: QueryApiFind<Model, PrimaryParams>;
  private listFn?: QueryApiList<Model, SearchParams>;
  constructor(props: QueryApiProps<Model, PrimaryParams, SearchParams>) {
    this.key = props.key;
    this.modelName = props.modelName;
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
          toast.error(this.makeToastMessage("error"));
          throw e;
        }
      },
    });
  }

  protected makeToastMessage(type: "success" | "pending" | "error"): string {
    let message = "";
    if (this.modelName) {
      message += this.modelName;
    }
    switch (type) {
      case "success":
        if (message == "") {
          message += "取得に成功";
        } else {
          message += "の取得に成功";
        }
        break;
      case "pending":
        if (message == "") {
          message += "取得中";
        } else {
          message += "を取得中";
        }
        break;
      default:
        break;
    }
    return message;
  }
}
