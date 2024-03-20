import { DetailedHTMLProps, FC, LabelHTMLAttributes } from "react";
import { cn } from "../utils/classname.util";

interface UIFormControlProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  labelText?: string;
  topRightText?: string;
  bottomLeftText?: string;
  bottomRightText?: string;
}

const UIFormControl: FC<UIFormControlProps> = ({
  className,
  children,
  labelText,
  topRightText,
  bottomLeftText,
  bottomRightText,
  ...props
}) => {
  return (
    <label className={cn("form-control", className)} {...props}>
      <div className="label">
        <span className="label-text">{labelText}</span>
        <span className="label-text-alt">{topRightText}</span>
      </div>
      {children}
      <div className="label">
        <span className="label-text-alt">{bottomLeftText}</span>
        <span className="label-text-alt">{bottomRightText}</span>
      </div>
    </label>
  );
};

export default UIFormControl;
