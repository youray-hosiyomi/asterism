import { FC } from "react";
import { Auth } from "../../app/api/auth.api";
import { LucideIcon } from "lucide-react";

export type GuestPageProps = object;
export type AuthPageProps = {
  auth: Auth;
};

export type GuestPageFC = FC;
export type AuthPageFC = FC<AuthPageProps>;

export type PageLink<Props extends object, Path extends string = string> = {
  path: Path;
  name: string;
  page: FC<Props>;
  layout?: FC<Props>;
  icon?: LucideIcon;
  parentPath?: Path;
};

export type PageLinkConfig<Props extends object, Path extends string = string> = {
  [path in Path]: PageLink<Props, Path>;
};

export type PageLinkMap<Props extends object> = PageLink<Props> & {
  childPathes: string[];
  children: PageLinkMap<Props>[];
};
