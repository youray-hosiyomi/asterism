/* eslint-disable react-hooks/rules-of-hooks */
import { URLSearchParamsInit, createSearchParams, useSearchParams } from "react-router-dom";

export type SearchQueryHandlerConfig<Params> = {
  toParams: (search: URLSearchParams) => Params;
  toSearchInit: (params: Params) => URLSearchParamsInit;
};

export type UseParamsReturns<Params> = {
  params: Params;
  setParams: (params: Params) => void;
};

export class SearchQueryHandler<Params> {
  protected config: SearchQueryHandlerConfig<Params>;
  constructor(config: SearchQueryHandlerConfig<Params>) {
    this.config = config;
  }
  public makeSeach(params: Params): URLSearchParams {
    return createSearchParams(this.config.toSearchInit(params));
  }
  public useParams(): UseParamsReturns<Params> {
    const [searchParams, setSearchParams] = useSearchParams();
    return {
      params: this.config.toParams(searchParams),
      setParams: (params) => {
        setSearchParams(this.makeSeach(params));
      },
    };
  }
}
