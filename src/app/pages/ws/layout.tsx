import UILayout from "../../ui/layout.ui";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthLayoutFC } from "@/common/type/page.type";
import AuthUserButton from "@/app/components/auth/auth-user-button.component";
import { useMemo } from "react";
import { wsPageLinkMaps } from "@/common/config/page-link.config";
import { cn } from "@/common/utils/classname.util";

const linkMaps = wsPageLinkMaps;

const WS_Layout: AuthLayoutFC = ({ auth }) => {
  const location = useLocation();
  const layoutSideMenuClass: string = useMemo(() => {
    const className = "w-full md:w-80 lg:w-16 !transition-all";
    return className;
  }, []);
  return (
    <>
      <UILayout
        header={{
          leftItems: <h1 className="text-lg font-bold">ASTERISM</h1>,
          rightItems: (
            <>
              <AuthUserButton auth={auth} />
            </>
          ),
        }}
        sideMenu={{
          content: (
            <>
              <div className="p-2">
                <ul className="menu bg-base-200 rounded-box">
                  {linkMaps.map((l) => {
                    return (
                      <li key={l.path} title={l.name}>
                        <Link
                          to={l.path}
                          className={cn(
                            "lg:px-0 lg:py-2 lg:items-center lg:justify-center",
                            l.path == location.pathname ? "active" : null,
                          )}
                        >
                          {l.icon && <l.icon className="w-5 h-5" />}
                          <span className="lg:hidden">{l.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ),
          header: <></>,
          className: layoutSideMenuClass,
        }}
      >
        <Outlet />
      </UILayout>
    </>
  );
};

export default WS_Layout;
