import { cn } from "@/common/utils/classname.util";
import { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from "react";

export type UILoadingKind = "spiner";

export interface UILoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  kind?: UILoadingKind;
}

function getClassNameByKind(kind?: UILoadingKind): string {
  let className = "";
  if (kind == "spiner") {
    className = "loading-spinner";
  }
  return className;
}

export const UILoading: FC<UILoadingProps> = ({ className, kind, ...props }) => {
  const classNameByKind = useMemo(() => getClassNameByKind(kind), [kind]);
  return (
    <>
      <span {...props} className={cn("loading", classNameByKind, className ?? "")} />
    </>
  );
};
