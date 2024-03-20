import { CalendarCheckIcon, FileStackIcon, FolderSyncIcon, HomeIcon, LogInIcon } from "lucide-react";
import { makePageLinkMaps } from "../../common/utils/page.util";
import { AuthPageProps, GuestPageProps, PageLinkConfig, PageLinkMap } from "../../common/type/page.type";
import Login_Page from "@/app/pages/login/page";
import WS_Page from "@/app/pages/ws/page";
import WS_Schedules_Page from "@/app/pages/ws/schedules/page";
import WS_Repositories_Page from "@/app/pages/ws/repositories/page";
import WS_Projects_Page from "@/app/pages/ws/projects/page";
import WS_Repositories_New_Page from "@/app/pages/ws/repositories/new/page";
import WS_Projects_New_Page from "@/app/pages/ws/projects/new/page";
import Repository_Page from "@/app/pages/repositories/[repositoryId]/page";
import Project_Page from "@/app/pages/projects/[projectId]/page";

export type PagePath = GuestPagePath | AuthPagePath;
export type GuestPagePath = "/login";
export type AuthPagePath = WSPagePath | RepositoryPagePath | ProjectPagePath;
export type WSPagePath =
  | "/ws"
  | "/ws/schedules"
  | "/ws/repositories"
  | "/ws/repositories/new"
  | "/ws/projects"
  | "/ws/projects/new";
export type RepositoryPagePath = "/repositories/:repositoryId";
export type ProjectPagePath = "/projects/:projectId";

export const guestPageLinkConfig: PageLinkConfig<GuestPageProps, GuestPagePath> = {
  "/login": {
    path: "/login",
    name: "Login",
    page: Login_Page,
    icon: LogInIcon,
  },
};
export const wsPageLinkConfig: PageLinkConfig<AuthPageProps, WSPagePath> = {
  "/ws": {
    path: "/ws",
    name: "Workspace",
    page: WS_Page,
    icon: HomeIcon,
  },
  "/ws/schedules": {
    path: "/ws/schedules",
    name: "Schedules",
    page: WS_Schedules_Page,
    icon: CalendarCheckIcon,
  },
  "/ws/repositories": {
    path: "/ws/repositories",
    name: "Repositories",
    page: WS_Repositories_Page,
    icon: FolderSyncIcon,
  },
  "/ws/repositories/new": {
    path: "/ws/repositories/new",
    name: "New Repository",
    page: WS_Repositories_New_Page,
    parentPath: "/ws/repositories",
  },
  "/ws/projects": {
    path: "/ws/projects",
    name: "Projects",
    page: WS_Projects_Page,
    icon: FileStackIcon,
  },
  "/ws/projects/new": {
    path: "/ws/projects/new",
    name: "New Project",
    page: WS_Projects_New_Page,
    parentPath: "/ws/projects",
  },
};
export const repositoryPageLinkConfig: PageLinkConfig<AuthPageProps, RepositoryPagePath> = {
  "/repositories/:repositoryId": {
    path: "/repositories/:repositoryId",
    name: "Home",
    page: Repository_Page,
    icon: HomeIcon,
  },
};
export const projectPageLinkConfig: PageLinkConfig<AuthPageProps, ProjectPagePath> = {
  "/projects/:projectId": {
    path: "/projects/:projectId",
    name: "Home",
    page: Project_Page,
    icon: HomeIcon,
  },
};

export const guestPageLinkMaps: PageLinkMap<GuestPageProps>[] = makePageLinkMaps(guestPageLinkConfig);
export const wsPageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(wsPageLinkConfig);
export const repositoryPageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(repositoryPageLinkConfig);
export const projectPagePageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(projectPageLinkConfig);
