/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { RenderRuleObject, RenderRuleType, RenderRuleValueKind } from "../../../types/render-rule.type";
import { renderRuleTypes, renderRuleValueKinds } from "../../../config/render-rule.config";
import UIDialog, { UIDialogHandler } from "@/common/ui/dialog.ui";

interface RepositoryRenderRuleFieldProps {
  req: RenderRuleObject;
  onChange: (req: RenderRuleObject) => void;
}

const RenderRuleItem: FC<RepositoryRenderRuleFieldProps & { numberOnly?: boolean }> = ({ req: initReq, onChange }) => {
  const dialogHandler = useRef<UIDialogHandler>(null);
  const [req, setReq] = useState(initReq);
  useEffect(() => {
    setReq(initReq);
  }, [initReq]);
  const content = useMemo(() => {
    if (initReq.kind == "group") {
      return (
        <>
          <RenderRuleItem
            req={initReq.firstItem.obj}
            numberOnly={initReq.type == "number"}
            onChange={(next) => {
              onChange({
                ...initReq,
                firstItem: {
                  obj: next as any,
                },
              });
            }}
          />
          {initReq.leastItems.map((item, index) => {
            return (
              <RenderRuleItem
                key={index}
                req={item.obj}
                numberOnly={initReq.type == "number"}
                onChange={(next) => {
                  onChange({
                    ...initReq,
                    leastItems: initReq.leastItems.map((defaultItem, i) => {
                      if (i == index) {
                        return next as any;
                      } else {
                        return defaultItem;
                      }
                    }),
                  });
                }}
              />
            );
          })}
        </>
      );
    }
    return <>{initReq.type}</>;
  }, [initReq, onChange]);
  return (
    <>
      <div
        className="border rounded-sm p-2 hover:shadow-md"
        onClick={() => {
          dialogHandler.current?.open();
        }}
      >
        {content}
      </div>
      <UIDialog
        ref={dialogHandler}
        onClose={() => {
          setReq(initReq);
        }}
      >
        <div className="space-y-3">
          <div>
            <select
              className="select select-sm select-bordered"
              value={req.type}
              onChange={(ev) => {
                const type = ev.target.value as unknown as RenderRuleType;
                if (type !== req.type) {
                  if (type == "number") {
                    setReq({
                      type,
                      kind: "value",
                      value: 0,
                    });
                  } else {
                    setReq({
                      type,
                      kind: "value",
                      value: "",
                    });
                  }
                }
              }}
            >
              {renderRuleTypes.map((opt, index) => {
                return (
                  <option key={index} value={opt.value}>
                    {opt.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <select
              className="select select-sm select-bordered"
              value={req.kind}
              onChange={(ev) => {
                const kind = ev.target.value as unknown as RenderRuleValueKind;
                if (kind !== req.kind) {
                  setReq((prev) => {
                    const type = prev.type;
                    if (type == "number") {
                      switch (kind) {
                        case "value":
                          return {
                            type,
                            kind,
                            value: 0,
                          };
                        case "column":
                          return {
                            type,
                            kind,
                            columnId: "",
                          };
                        case "fkColumn":
                          return {
                            type,
                            kind,
                            fkColumnId: "",
                            targetFkColumnId: "",
                          };
                        case "renderColumn":
                          return {
                            type,
                            kind,
                            renderColumnId: "",
                          };
                        case "group":
                          return {
                            type,
                            kind,
                            firstItem: {
                              obj: {
                                type,
                                kind: "value",
                                value: 0,
                              },
                            },
                            leastItems: [],
                          };
                      }
                    } else {
                      switch (kind) {
                        case "value":
                          return {
                            type,
                            kind,
                            value: "",
                          };
                        case "column":
                          return {
                            type,
                            kind,
                            columnId: "",
                          };
                        case "fkColumn":
                          return {
                            type,
                            kind,
                            fkColumnId: "",
                            targetFkColumnId: "",
                          };
                        case "renderColumn":
                          return {
                            type,
                            kind,
                            renderColumnId: "",
                          };
                        case "group":
                          return {
                            type,
                            kind,
                            firstItem: {
                              obj: {
                                type,
                                kind: "value",
                                value: "",
                              },
                            },
                            leastItems: [],
                          };
                      }
                    }
                  });
                }
              }}
            >
              {renderRuleValueKinds
                .filter((opt) => !opt.disabled)
                .map((opt, index) => {
                  return (
                    <option key={index} value={opt.value}>
                      {opt.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <button
              className="btn btn-sm"
              onClick={() => {
                dialogHandler.current?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                onChange(req);
                dialogHandler.current?.close();
              }}
            >
              Change
            </button>
          </div>
        </div>
      </UIDialog>
    </>
  );
};

const RepositoryRenderRuleField: FC<RepositoryRenderRuleFieldProps> = ({ req, onChange }) => {
  return (
    <>
      <div className="flex border rounded-sm p-2 overflow-x-auto">
        <RenderRuleItem req={req} onChange={onChange} />
      </div>
    </>
  );
};

export default RepositoryRenderRuleField;
