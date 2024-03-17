import { RouteObject } from "react-router-dom";
import { PageLink, PageLinkConfig, PageLinkMap } from "../type/page.type";

export function makePageLinkMaps<Props extends object>(config: PageLinkConfig<Props>): PageLinkMap<Props>[] {
  const keys = Object.keys(config);
  function makeMaps(parentPath?: string) {
    const maps: PageLinkMap<Props>[] = [];
    keys.forEach((key) => {
      const link: PageLink<Props> = config[key];
      if (link && parentPath == link.parentPath) {
        const childPathes: string[] = [];
        const childMaps = makeMaps(link.path);
        childMaps.forEach((m) => {
          childPathes.push(m.path);
          childPathes.push(...m.childPathes);
        });
        maps.push({
          ...link,
          childPathes,
          children: childMaps,
        });
      }
    });
    return maps;
  }
  return makeMaps();
}

export function makeRoutes<Props extends object>(
  props: Props,
  maps: PageLinkMap<Props>[],
  parentMap?: PageLinkMap<Props>,
): RouteObject[] {
  const routes: RouteObject[] = [];
  if (parentMap) {
    routes.push({
      index: true,
      element: <parentMap.page {...props} />,
    });
  }
  routes.push(
    ...maps.map((map) => {
      const children = maps.length == 0 ? [] : makeRoutes(props, map.children, map);
      return {
        path: map.path,
        element: map.layout ? <map.layout {...props} /> : undefined,
        children,
      };
    }),
  );
  return routes;
}
