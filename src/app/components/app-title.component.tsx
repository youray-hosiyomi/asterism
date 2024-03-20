import { cn } from "@/common/utils/classname.util";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface AppTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const AppTitle: FC<AppTitleProps> = ({
  children = import.meta.env.VITE_APP_TITLE ?? "ASTERISM",
  className,
  ...props
}) => {
  return (
    <>
      <h1 {...props} className={cn(className, "select-none")} translate="no">
        {children}
      </h1>
    </>
  );
};

export default AppTitle;
