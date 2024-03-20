import {
  DetailedHTMLProps,
  DialogHTMLAttributes,
  // ForwardRefExoticComponent,
  // ForwardRefRenderFunction,
  // RefAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "../utils/classname.util";

interface UIDialogProps extends DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement> {}

export type UIDialogHandler = {
  dialog: HTMLDialogElement | null;
  close(): void;
  open(): void;
};

const UIDialog = forwardRef<UIDialogHandler, UIDialogProps>(({ className, children, ...props }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
  }, [dialogRef]);
  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }
  }, [dialogRef]);
  useImperativeHandle(
    ref,
    () => {
      const dialog = dialogRef.current;
      return {
        dialog,
        close,
        open,
      };
    },
    [dialogRef, close, open],
  );
  return (
    <>
      <dialog {...props} ref={dialogRef} className={cn("modal", className)}>
        <div className="modal-box">{children}</div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

export default UIDialog;
