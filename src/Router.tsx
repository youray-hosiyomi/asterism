import { FC, useMemo } from "react";
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  guestPageLinkConfig,
  guestPageLinkMaps,
  wsPageLinkConfig,
  wsPageLinkMaps,
} from "./common/config/page-link.config";
import WS_Layout from "./app/pages/ws/layout";
import { useAuthContext } from "./app/hooks/auth.hook";
import { makeRoutes } from "./common/utils/page.util";

const Router: FC = () => {
  const { auth } = useAuthContext();
  const router = useMemo(() => {
    const routes: RouteObject[] = auth
      ? [
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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
