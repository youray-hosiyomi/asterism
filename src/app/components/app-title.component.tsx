import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface AppTitleProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const AppTitle: FC<AppTitleProps> = ({ children = import.meta.env.VITE_APP_TITLE ?? "ASTERISM", ...props }) => {
  return (
    <>
      <h1 {...props}>{children}</h1>
    </>
  );
};

export default AppTitle;
