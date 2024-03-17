import { cn } from "@/common/utils/classname.util";
import { AlignJustify, XIcon } from "lucide-react";
import { CSSProperties, FC, ReactNode } from "react";

export type UILayoutSideMenuProps = {
  content: ReactNode;
  header?: ReactNode;
  width?: number;
  className?: string;
  style?: CSSProperties;
};

export type UILayoutHeaderProps = {
  leftItems?: ReactNode;
  rightItems?: ReactNode;
};

export interface UILayoutProps {
  sideMenu?: UILayoutSideMenuProps;
  header?: UILayoutHeaderProps;
  children: ReactNode;
}

const UILayout: FC<UILayoutProps> = ({ children, sideMenu, header }) => {
  const content = (
    <>
      {header && (
        <header className="bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center shadow-md border-b border-gray-200 duration-100">
          <nav className="navbar w-full">
            <div className="flex flex-1 md:gap-1 lg:gap-2">
              {!!sideMenu && (
                <span
                  className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)] lg:hidden"
                  data-tip="Menu"
                >
                  <label aria-label="Open menu" htmlFor="drawer" className="btn btn-square btn-ghost drawer-button">
                    <AlignJustify className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" />
                  </label>
                </span>
              )}
              {header.leftItems}
            </div>
            <div className="flex flex-0 md:gap-1 lg:gap-2">{header.rightItems}</div>
          </nav>
        </header>
      )}
      <main className="">{children}</main>
      <footer></footer>
    </>
  );

  if (!sideMenu) return <div className="bg-base-100">{content}</div>;

  return (
    <div className="bg-base-100 drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{content}</div>
      <div className="drawer-side z-40 shadow-lg border-r border-gray-200" style={{ scrollBehavior: "smooth" }}>
        <label htmlFor="drawer" className="drawer-overlay" aria-label="Close menu"></label>
        <aside className={cn("bg-base-100 min-h-screen", sideMenu.className)} style={sideMenu.style}>
          {sideMenu.header && (
            <nav className="bg-base-100 sticky top-0 z-10 w-full gap-y-2 h-16 shadow-md flex">
              <div className="flex-auto">{sideMenu.header}</div>
              <div className="flex-none md:hidden pr-6 flex items-center">
                <label htmlFor="drawer" className="btn btn-sm rounded-full w-8 h-8 p-0" aria-label="Close menu">
                  <XIcon className="w-6 h-6" />
                </label>
              </div>
            </nav>
          )}
          <div className="max-md:pr-6">{sideMenu.content}</div>
        </aside>
      </div>
    </div>
  );
};

export default UILayout;
