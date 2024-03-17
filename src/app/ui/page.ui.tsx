import { FC, ReactNode } from "react";

export interface UIPageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  footer?: ReactNode;
}

const UIPage: FC<UIPageProps> = ({ footer, ...props }) => {
  return (
    <>
      <div {...props} />
      {footer ? (
        <>
          <div className="sticky bottom-0 border-t z-10 bg-base-100">{footer}</div>
        </>
      ) : null}
    </>
  );
};

export default UIPage;
