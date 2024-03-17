import { CalendarCheckIcon, FileStackIcon, FolderSyncIcon, HomeIcon, LogInIcon } from "lucide-react";
import { makePageLinkMaps } from "../utils/page.util";
import { AuthPageProps, GuestPageProps, PageLinkConfig, PageLinkMap } from "../type/page.type";
import Login_Page from "@/app/pages/login/page";
import WS_Page from "@/app/pages/ws/page";
import WS_Schedules_Page from "@/app/pages/ws/schedules/page";
import WS_Repositories_Page from "@/app/pages/ws/repositories/page";
import WS_Projects_Page from "@/app/pages/ws/projects/page";

export type PagePath = GuestPagePath | AuthPagePath;
export type GuestPagePath = "/login";
export type AuthPagePath = WSPagePath;
export type WSPagePath = "/ws" | "/ws/schedules" | "/ws/repositories" | "/ws/projects";

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
  "/ws/projects": {
    path: "/ws/projects",
    name: "Projects",
    page: WS_Projects_Page,
    icon: FileStackIcon,
  },
};

export const guestPageLinkMaps: PageLinkMap<GuestPageProps>[] = makePageLinkMaps(guestPageLinkConfig);
export const wsPageLinkMaps: PageLinkMap<AuthPageProps>[] = makePageLinkMaps(wsPageLinkConfig);
