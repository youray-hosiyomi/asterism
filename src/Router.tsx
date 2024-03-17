import { FC, useMemo } from "react";
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  guestPageLinkConfig,
  guestPageLinkMaps,
  projectPageLinkConfig,
  projectPagePageLinkMaps,
  repositoryPageLinkConfig,
  repositoryPageLinkMaps,
  wsPageLinkConfig,
  wsPageLinkMaps,
} from "./common/config/page-link.config";
import WS_Layout from "./app/pages/ws/layout";
import { useAuthContext } from "./app/hooks/auth.hook";
import { makeRoutes } from "./common/utils/page.util";
import { UILoading } from "./app/ui/loading.ui";
import Repository_Layout from "./app/pages/repositories/[repositoryId]/layout";
import Project_Layout from "./app/pages/projects/[projectId]/layout";

const Router: FC = () => {
  const { auth, isLoading } = useAuthContext();
  const router = useMemo(() => {
    const routes: RouteObject[] = auth
      ? [
          {
            path: repositoryPageLinkConfig["/repositories/:repositoryId"].path,
            element: <Repository_Layout auth={auth} />,
            children: makeRoutes({ auth }, repositoryPageLinkMaps),
          },
          {
            path: projectPageLinkConfig["/projects/:projectId"].path,
            element: <Project_Layout auth={auth} />,
            children: makeRoutes({ auth }, projectPagePageLinkMaps),
          },
          {
            path: wsPageLinkConfig["/ws"].path,
            element: <WS_Layout auth={auth} />,
            children: makeRoutes({ auth }, wsPageLinkMaps),
          },
          {
            path: "*",
            element: <Navigate to={wsPageLinkConfig["/ws"].path} />,
          },
        ]
      : [
          ...makeRoutes({}, guestPageLinkMaps),
          {
            path: "*",
            element: <Navigate to={guestPageLinkConfig["/login"].path} />,
          },
        ];
    return createBrowserRouter(routes);
  }, [auth]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-52">
        <UILoading />
      </div>
    );
  }
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
