import { RouteObject } from "react-router-dom";
import { PageLink, PageLinkConfig, PageLinkMap } from "../type/page.type";

export function makePageLinkMaps<Props extends object>(config: PageLinkConfig<Props>): PageLinkMap<Props>[] {
  const keys = Object.keys(config);
  function makeMaps(parentPath?: string) {
    const maps: PageLinkMap<Props>[] = [];
    keys.forEach((key) => {
      const link: PageLink<Props> = config[key];
      if (link && parentPath == link.parentPath) {
        maps.push({
          ...link,
          children: makeMaps(link.path),
        });
      }
    });
    return maps;
  }
  return makeMaps();
}

export function makeRoutes<Props extends object>(props: Props, maps: PageLinkMap<Props>[]): RouteObject[] {
  return maps.map((map) => {
    const children = maps.length == 0 ? [] : makeRoutes(props, map.children);
    return {
      path: map.path,
      element: <map.page {...props} />,
      children,
    };
  });
}
